<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				"User IPs (<xsl:value-of select="results/unique_ip_count"/> unique IPs)"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Date/Time"
				,"IP"
				<br/>
				<xsl:for-each select="results/ips/ips_subitem">
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="start_time"/>"
					,"<xsl:value-of select="ip"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<head>
					<title>User IPs</title>
				</head>
				<body bgcolor="#CCCCCC">
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Date/Time</b></td>
							<td><b>IP</b></td>
						</tr>
						<xsl:for-each select="results/ips/ips_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td valign="top"><xsl:value-of select="start_time"/></td>
								<td valign="top"><xsl:value-of select="ip"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>