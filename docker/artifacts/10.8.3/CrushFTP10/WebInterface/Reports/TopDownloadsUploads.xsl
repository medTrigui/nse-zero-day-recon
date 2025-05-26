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
				"Top Downloads And Uploads"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Downloads"<br/>
				,"Rank","Count","Average Speed","Size","Name"
				<xsl:if test="$showFormInfo = 'true'">,"Form Info"</xsl:if>
				<xsl:if test="$showURLs = 'true'">,"Local URL"</xsl:if>
				<br/>
				<xsl:for-each select="results/downloads/downloads_subitem">
					,"<xsl:value-of select="position()"/>"
					,"<xsl:value-of select="count"/>"
					,"<xsl:value-of select="averageSpeed"/> K/sec"
					,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
					,"<xsl:if test="$showPaths = 'true'"><xsl:value-of select="path"/></xsl:if><xsl:value-of select="name"/>"
					<xsl:if test="$showFormInfo = 'true'">,""</xsl:if>
					<xsl:if test="$showURLs = 'true'">,"<xsl:value-of select="url"/>"</xsl:if>
					<br/>
				</xsl:for-each>
				"Uploads"<br/>
				,"Num","Count","Average Speed","Size","Name"
				<xsl:if test="$showURLs = 'true'">,"Local URL"</xsl:if>
				<br/>
				<xsl:for-each select="results/uploads/uploads_subitem">
					,"<xsl:value-of select="position()"/>"
					,"<xsl:value-of select="count"/>"
					,"<xsl:value-of select="averageSpeed"/> K/sec"
					,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
					,"<xsl:if test="$showPaths = 'true'"><xsl:value-of select="path"/></xsl:if><xsl:value-of select="name"/>"
					<xsl:if test="$showFormInfo = 'true'">
						,"
							<xsl:for-each select="metaInfo/*">
								<xsl:if test="name() != 'UploadFormId'">
									'<xsl:value-of select="name()"/>:<xsl:value-of select="."/>', 
								</xsl:if>
							</xsl:for-each>
						"
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
					<title>Top Downloads And Uploads</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Top Downloads And Uploads</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td><b>Downloads</b></td>
						</tr>
						<tr>
							<td></td>
							<td><b>Rank</b></td>
							<td><b>Count</b></td>
							<td><b>Average Speed</b></td>
							<td><b>Size</b></td>
							<td><b>Name</b></td>
							<xsl:if test="$showFormInfo = 'true'"><td nowrap="nowrap"></td></xsl:if>
							<xsl:if test="$showURLs = 'true'"><td nowrap="nowrap"><b>Local URL</b></td></xsl:if>
						</tr>
						<xsl:for-each select="results/downloads/downloads_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap"><xsl:value-of select="position()"/></td>
								<td nowrap="nowrap"><xsl:value-of select="count"/></td>
								<td nowrap="nowrap"><xsl:value-of select="averageSpeed"/> K/sec</td>
								<td nowrap="nowrap"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></td>
								<td><xsl:if test="$showPaths = 'true'"><xsl:value-of select="path"/></xsl:if><xsl:value-of select="name"/></td>
								<xsl:if test="$showFormInfo = 'true'"><td nowrap="nowrap"></td></xsl:if>
								<xsl:if test="$showURLs = 'true'"><td nowrap="nowrap"><font size="-2"><xsl:value-of select="url"/></font></td></xsl:if>
							</tr>
						</xsl:for-each>
						<tr>
							<td><b>Uploads</b></td>
						</tr>
						<tr>
							<td></td>
							<td><b>Num</b></td>
							<td></td>
							<td><b>Average Speed</b></td>
							<td><b>Size</b></td>
							<td><b>Name</b></td>
							<xsl:if test="$showFormInfo = 'true'"><td nowrap="nowrap"><b>Form Info</b></td></xsl:if>
							<xsl:if test="$showURLs = 'true'"><td nowrap="nowrap"><b>Local URL</b></td></xsl:if>
						</tr>
						<xsl:for-each select="results/uploads/uploads_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="position()"/></td>
								<td nowrap="nowrap" valign="top"></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="averageSpeed"/> K/sec</td>
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