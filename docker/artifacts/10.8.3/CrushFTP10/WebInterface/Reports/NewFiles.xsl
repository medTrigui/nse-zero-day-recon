<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showIPs"><xsl:value-of select="results/showIPs"/></xsl:variable>
				<head>
					<title>New Files</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>New Files</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>File Count</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td valign="top"><xsl:value-of select="fileCount"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"New Files"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"File Count"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="fileCount"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>