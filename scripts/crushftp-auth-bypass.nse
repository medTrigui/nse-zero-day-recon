local shortport = require "shortport"
local http = require "http"
local stdnse = require "stdnse"

description = [[
  This script is intended to detect the authentication bypass vulnerability in CrushFTP v10.8.3 by sending crafted HTTP requests and analying the response to determine if the server can be accessed without valid credentials.
]]

---
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
categories = {"auth", "exploit", "vuln"}

porturl = shortport.http

action = function(host, port)

-- Send unauthenticated request to path
--     using http.get(host, port, "path")





end
