<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				<xsl:variable name="showPaths"><xsl:value-of select="results/showPaths"/></xsl:variable>
				<xsl:variable name="showURLs"><xsl:value-of select="results/showURLs"/></xsl:variable>
				<xsl:variable name="showFormInfo"><xsl:value-of select="results/showFormInfo"/></xsl:variable>
				"SharesSummary"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Shares"<br/>
				,"Shared By","To","Username","Shared On","Expires On","Size","Path"
				<xsl:if test="$showFormInfo = 'true'">,"MetaInfo"</xsl:if>
				<xsl:if test="$showURLs = 'true'">,"Local URL"</xsl:if>
				<br/>
				<xsl:for-each select="results/shares/shares_subitem">
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="shareUsernames"/><xsl:text> </xsl:text><xsl:value-of select="emailTo"/>"
					,"<xsl:value-of select="share_user_name"/>"
					,"<xsl:value-of select="share_time"/>"
					,"<xsl:value-of select="expire"/>"
					,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
					,"<xsl:if test="$showPaths = 'true'"><xsl:value-of select="path"/></xsl:if><xsl:if test="$showPaths = 'false'"><xsl:value-of select="name"/></xsl:if>"
					<xsl:if test="$showFormInfo = 'true'">
							<xsl:for-each select="metaInfo/*">
								<xsl:if test="name() != 'UploadFormId'">
									<br/>
									,""
									,""
									,""
									,""
									,"<xsl:value-of select="name()"/>"
									,"<xsl:value-of select="."/>"
								</xsl:if>
							</xsl:for-each>
					</xsl:if>
					<xsl:if test="$showURLs = 'true'">,"<xsl:value-of select="url"/>"</xsl:if>
					<br/>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<xsl:variable name="showPaths"><xsl:value-of select="results/showPaths"/></xsl:variable>
				<xsl:variable name="showURLs"><xsl:value-of select="results/showURLs"/></xsl:variable>
				<xsl:variable name="showFormInfo"><xsl:value-of select="results/showFormInfo"/></xsl:variable>
				<head>
					<title>Shares Summary</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Shares Summary</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td><b>Shares</b></td>
						</tr>
						<tr>
							<td><b>Shared By</b></td>
							<td><b>To</b></td>
							<td><b>Username</b></td>
							<td><b>Shared On</b></td>
							<td><b>Expires On</b></td>
							<td><b>Size</b></td>
							<td><b>Name</b></td>
							<xsl:if test="$showFormInfo = 'true'"><td nowrap="nowrap"><b>Form Info</b></td></xsl:if>
							<xsl:if test="$showURLs = 'true'"><td nowrap="nowrap"><b>Local URL</b></td></xsl:if>
						</tr>
						<xsl:for-each select="results/shares/shares_subitem">
							<tr>
								<td valign="top"><xsl:value-of select="username"/></td>
								<td valign="top"><xsl:value-of select="emailTo"/></td>
								<td valign="top"><xsl:value-of select="share_user_name"/></td>
								<td valign="top"><xsl:value-of select="share_time"/></td>
								<td valign="top"><xsl:value-of select="expire"/></td>
								<td nowrap="nowrap" valign="top"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></td>
								<td valign="top"><xsl:if test="$showPaths = 'true'"><xsl:value-of select="path"/></xsl:if><xsl:value-of select="name"/></td>
								<xsl:if test="$showFormInfo = 'true'">
									<td nowrap="nowrap" valign="top"> 
										<table>
										<xsl:for-each select="metaInfo/*">
											<xsl:if test="name() != 'UploadFormId'">
												<tr>
													<td><font size="-2"><b><xsl:value-of select="name()"/></b></font></td>
													<td><font size="-2"><xsl:value-of select="."/></font></td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										</table>
									</td>
								</xsl:if>
								<xsl:if test="$showURLs = 'true'"><td nowrap="nowrap" valign="top"><font size="-2"><xsl:value-of select="url"/></font></td></xsl:if>
							</tr>
						</xsl:for-each>
					</table>
				</body>
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