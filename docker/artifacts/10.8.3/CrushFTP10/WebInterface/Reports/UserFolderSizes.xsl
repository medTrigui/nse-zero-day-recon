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
					<title>User Folder Sizes</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>User Folder Sizes</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Folder Size</b></td>
							<td><b>File Count</b></td>
							<td><b>Quota</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td valign="top"><xsl:value-of select="fileSizeFormatted"/></td>
								<td valign="top"><xsl:value-of select="fileCount"/></td>
								<td valign="top"><xsl:value-of select="quotaFormatted"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"User Folder Sizes"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Folder Size"
				,"Folder Size Formatted"
				,"File Count"
				,"Quota"
				,"Quota Formatted"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="fileSize"/>"
					,"<xsl:value-of select="fileSizeFormatted"/>"
					,"<xsl:value-of select="fileCount"/>"
					,"<xsl:value-of select="quota"/>"
					,"<xsl:value-of select="quotaFormatted"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>