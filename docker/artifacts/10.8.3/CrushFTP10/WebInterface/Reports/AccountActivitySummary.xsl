<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Account Activity Summary</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Account Activity Summary</b></center><br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5" border="1">
						<tr>
							<td nowrap="nowrap" valign="top"><b>User</b><br/><xsl:value-of select="results/userCount"/> sessions.</td>
							<td nowrap="nowrap" valign="top"><b>IP</b></td>
							<td nowrap="nowrap" valign="top"><b>Date</b></td>
							<td nowrap="nowrap" valign="top"><b>Duration</b><br/><xsl:value-of select="results/duration"/></td>
							<td nowrap="nowrap" valign="top"><b>Activity</b></td>
							<td nowrap="nowrap" valign="top"><b>Uploads</b><br/><xsl:value-of select="results/uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes" /></xsl:call-template> total.</td>
							<td nowrap="nowrap" valign="top"><b>Downloads</b><br/><xsl:value-of select="results/downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/downloadBytes" /></xsl:call-template> total.</td>
							<td nowrap="nowrap" valign="top"><b>Deletes</b><br/><xsl:value-of select="results/deleteCount"/> deletes.</td>
							<td nowrap="nowrap" valign="top"><b>Renames</b><br/><xsl:value-of select="results/renameCount"/> renames.</td>
							<td nowrap="nowrap"><b>Totals</b><br/><xsl:value-of select="results/uploadCount + results/downloadCount"/> files transferred, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes + results/downloadBytes" /></xsl:call-template> total.</td>
						</tr>
						<xsl:for-each select="results/summary/summary_subitem">
							<tr>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="ip"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="start"/> - <xsl:value-of select="end"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="duration"/></td>
								<td nowrap="nowrap" valign="top"><xsl:if test="uploadCount != '0'">Upload </xsl:if><xsl:if test="downloadCount != '0'">Download</xsl:if></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template>.</td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template>.</td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="deleteCount"/> deletes.</td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="renameCount"/> renames.</td>
								<td nowrap="nowrap"><xsl:value-of select="downloadCount + uploadCount"/> files transferred, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes + uploadBytes" /></xsl:call-template>.</td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showBytes"><xsl:value-of select="results/showBytes"/></xsl:variable>
				"Account Activity Summary"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"User : <xsl:value-of select="results/userCount"/> sessions."
				,"Protocol"
				,"IP"
				,"Server Port"
				,"Date"
				,"Duration : <xsl:value-of select="results/duration"/>"
				,"Activity"
				,"Uploads : <xsl:value-of select="results/uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes" /></xsl:call-template> total."
				,"Downloads : <xsl:value-of select="results/downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/downloadBytes" /></xsl:call-template> total."
				,"Deletes : <xsl:value-of select="results/deleteCount"/> deletes."
				,"Renames : <xsl:value-of select="results/renameCount"/> renames."
				,"Totals : <xsl:value-of select="results/uploadCount + results/downloadCount"/> files transferred, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes + results/downloadBytes" /></xsl:call-template> total."
				<br/>
				<xsl:for-each select="results/summary/summary_subitem">
					"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="protocol"/>"
					,"<xsl:value-of select="ip"/>"
					,"<xsl:value-of select="server_port"/>"
					,"<xsl:value-of select="start"/> - <xsl:value-of select="end"/>"
					,"<xsl:value-of select="duration"/>"
					,"<xsl:if test="uploadCount != '0'">Upload </xsl:if><xsl:if test="downloadCount != '0'">Download</xsl:if>"
					,"<xsl:value-of select="uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template>."
					,"<xsl:value-of select="downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template>."
					,"<xsl:value-of select="deleteCount"/> deletes."
					,"<xsl:value-of select="renameCount"/> renames."
					,"<xsl:value-of select="downloadCount + uploadCount"/> files, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes + uploadBytes" /></xsl:call-template>."
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>

	<xsl:template name="formatBytes">
		<xsl:param name="data"/>
		<xsl:choose>
			<xsl:when test="string-length($data) &gt; 9"><xsl:value-of select="floor(100*($data div (1024 * 1024 * 1024))) div 100"/> GB</xsl:when>
			<xsl:when test="string-length($data) &gt; 6"><xsl:value-of select="floor(100*($data div (1024 * 1024))) div 100"/> MB</xsl:when>
			<xsl:when test="string-length($data) &gt; 3"><xsl:value-of select="floor(100*($data div (1024))) div 100"/> KB</xsl:when>
			<xsl:otherwise><xsl:value-of select="$data"/> bytes</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:transform>