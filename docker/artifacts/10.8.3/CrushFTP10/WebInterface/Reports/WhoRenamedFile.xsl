<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showBytes"><xsl:value-of select="results/showBytes"/></xsl:variable>
				"Who Renamed A File"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Username","Files"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					"<xsl:value-of select="username"/>"
					<br/>
					<xsl:for-each select="filesDetail/filesDetail_subitem">
						,"<xsl:value-of select="path"/>"<br/>
						,,"Dates"<br/>
						<xsl:for-each select="dates/dates_subitem">
							,,"<xsl:value-of select="."/>"<br/>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showBytes"><xsl:value-of select="results/showBytes"/></xsl:variable>
				<head>
					<title>Who Renamed A File</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Who Renamed A File</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Files</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top">
									<xsl:for-each select="filesDetail/filesDetail_subitem">
										<table cellpadding="0" cellspacing="0">
										<tr>
											<td>
												<xsl:value-of select="path"/>
											</td>
										</tr>
										<tr>
											<td>
												Dates:
											</td>
										</tr>
										<xsl:for-each select="dates/dates_subitem">
											<tr>
												<td><font size="-2"><xsl:value-of select="."/></font></td>
											</tr>
										</xsl:for-each>
										</table>
										<br/>
									</xsl:for-each>
								</td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>