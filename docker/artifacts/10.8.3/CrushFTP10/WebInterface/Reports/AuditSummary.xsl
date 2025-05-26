<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:variable name="showUploads"><xsl:value-of select="results/showUploads"/></xsl:variable>
			<xsl:variable name="showDownloads"><xsl:value-of select="results/showDownloads"/></xsl:variable>
			<xsl:variable name="showDeletes"><xsl:value-of select="results/showDeletes"/></xsl:variable>
			<xsl:variable name="showRenames"><xsl:value-of select="results/showRenames"/></xsl:variable>
			<xsl:variable name="showDates"><xsl:value-of select="results/showDates"/></xsl:variable>
			<xsl:variable name="showIPs"><xsl:value-of select="results/showIPs"/></xsl:variable>
			<xsl:variable name="showPaths"><xsl:value-of select="results/showPaths"/></xsl:variable>
			<xsl:variable name="showFiles"><xsl:value-of select="results/showFiles"/></xsl:variable>
			<xsl:variable name="showSizes"><xsl:value-of select="results/showSizes"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Audit Summary</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Audit Summary</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5" border="1">
						<tr>
							<td nowrap="nowrap"><b>User</b> : <xsl:value-of select="results/userCount"/> users.</td>
							<xsl:if test="$showUploads = 'true'">
								<td><b>Uploads</b> : <xsl:value-of select="results/uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes" /></xsl:call-template> total.</td>
							</xsl:if>
							<xsl:if test="$showDownloads = 'true'">
								<td><b>Downloads</b> : <xsl:value-of select="results/downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/downloadBytes" /></xsl:call-template> total.</td>
							</xsl:if>
							<xsl:if test="$showDeletes = 'true'">
								<td><b>Deletes</b> : <xsl:value-of select="results/deleteCount"/> deletes, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/deleteBytes" /></xsl:call-template> total.</td>
							</xsl:if>
							<xsl:if test="$showRenames = 'true'">
								<td><b>Renames</b> : <xsl:value-of select="results/renameCount"/> renames.</td>
							</xsl:if>
						</tr>
						<xsl:for-each select="results/summary/summary_subitem">
							<tr>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<xsl:if test="$showUploads = 'true'">
									<td valign="top">
										<xsl:value-of select="uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template> total.<br/>
										<xsl:if test="$showFiles = 'true'">
											<xsl:if test="uploadCount != '0'">
												<table border="0" cellpadding="1">
													<tr>
														<xsl:if test="$showDates = 'true'">
															<td nowrap="nowrap">Date</td>
														</xsl:if>
														<xsl:if test="$showIPs = 'true'">
															<td nowrap="nowrap">IP</td>
														</xsl:if>
														<xsl:if test="$showPaths = 'true'">
															<td>Path</td>
														</xsl:if>
														<td>File</td>
														<xsl:if test="$showSizes = 'true'">
															<td nowrap="nowrap">Size</td>
														</xsl:if>
														<xsl:if test="$showSizes = 'true'">
															<td nowrap="nowrap">Speed</td>
														</xsl:if>
													</tr>
													<xsl:for-each select="uploads/uploads_subitem">
														<tr>
															<xsl:if test="$showDates = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="date"/></font></td>
															</xsl:if>
															<xsl:if test="$showIPs = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="ip"/></font></td>
															</xsl:if>
															<xsl:if test="$showPaths = 'true'">
																<td><font size="-1"><xsl:value-of select="url"/></font></td>
															</xsl:if>
															<td><font size="-1"><xsl:value-of select="name"/></font></td>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></font></td>
															</xsl:if>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec</font></td>
															</xsl:if>
														</tr>
													</xsl:for-each>
												</table>
											</xsl:if>
										</xsl:if>
									</td>
								</xsl:if>
								<xsl:if test="$showDownloads = 'true'">
									<td valign="top">
										<xsl:value-of select="downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template> total.<br/>
										<xsl:if test="$showFiles = 'true'">
											<xsl:if test="downloadCount != '0'">
												<table border="0" cellpadding="1">
													<tr>
														<xsl:if test="$showDates = 'true'">
															<td nowrap="nowrap">Date</td>
														</xsl:if>
														<xsl:if test="$showIPs = 'true'">
															<td nowrap="nowrap">IP</td>
														</xsl:if>
														<xsl:if test="$showPaths = 'true'">
															<td>Path</td>
														</xsl:if>
														<td>File</td>
														<xsl:if test="$showSizes = 'true'">
															<td nowrap="nowrap">Size</td>
														</xsl:if>
													</tr>
													<xsl:for-each select="downloads/downloads_subitem">
														<tr>
															<xsl:if test="$showDates = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="date"/></font></td>
															</xsl:if>
															<xsl:if test="$showIPs = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="ip"/></font></td>
															</xsl:if>
															<xsl:if test="$showPaths = 'true'">
																<td><font size="-1"><xsl:value-of select="path"/></font></td>
															</xsl:if>
															<td><font size="-1"><xsl:value-of select="name"/></font></td>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></font></td>
															</xsl:if>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec</font></td>
															</xsl:if>
														</tr>
													</xsl:for-each>
												</table>
											</xsl:if>
										</xsl:if>
									</td>
								</xsl:if>
								<xsl:if test="$showDeletes = 'true'">
									<td valign="top">
										<xsl:value-of select="deleteCount"/> deletes, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="deleteBytes" /></xsl:call-template> total.<br/>
										<xsl:if test="$showFiles = 'true'">
											<xsl:if test="deleteCount != '0'">
												<table border="0" cellpadding="1">
													<tr>
														<xsl:if test="$showDates = 'true'">
															<td nowrap="nowrap">Date</td>
														</xsl:if>
														<xsl:if test="$showIPs = 'true'">
															<td nowrap="nowrap">IP</td>
														</xsl:if>
														<xsl:if test="$showPaths = 'true'">
															<td>Path</td>
														</xsl:if>
														<td>File</td>
														<xsl:if test="$showSizes = 'true'">
															<td nowrap="nowrap">Size</td>
														</xsl:if>
													</tr>
													<xsl:for-each select="deletes/deletes_subitem">
														<tr>
															<xsl:if test="$showDates = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="date"/></font></td>
															</xsl:if>
															<xsl:if test="$showIPs = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="ip"/></font></td>
															</xsl:if>
															<xsl:if test="$showPaths = 'true'">
																<td><font size="-1"><xsl:value-of select="path"/></font></td>
															</xsl:if>
															<td><font size="-1"><xsl:value-of select="name"/></font></td>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></font></td>
															</xsl:if>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec</font></td>
															</xsl:if>
														</tr>
													</xsl:for-each>
												</table>
											</xsl:if>
										</xsl:if>
									</td>
								</xsl:if>
								<xsl:if test="$showRenames = 'true'">
									<td valign="top">
										<xsl:value-of select="renameCount"/> renames.<br/>
										<xsl:if test="$showFiles = 'true'">
											<xsl:if test="renameCount != '0'">
												<table border="0" cellpadding="1">
													<tr>
														<xsl:if test="$showDates = 'true'">
															<td nowrap="nowrap">Date</td>
														</xsl:if>
														<xsl:if test="$showIPs = 'true'">
															<td nowrap="nowrap">IP</td>
														</xsl:if>
														<xsl:if test="$showPaths = 'true'">
															<td>Path</td>
														</xsl:if>
														<td>File</td>
														<xsl:if test="$showSizes = 'true'">
															<td nowrap="nowrap">Size</td>
														</xsl:if>
													</tr>
													<xsl:for-each select="renames/renames_subitem">
														<tr>
															<xsl:if test="$showDates = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="date"/></font></td>
															</xsl:if>
															<xsl:if test="$showIPs = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:value-of select="ip"/></font></td>
															</xsl:if>
															<xsl:if test="$showPaths = 'true'">
																<td><font size="-1"><xsl:value-of select="path"/></font></td>
															</xsl:if>
															<td><font size="-1"><xsl:value-of select="name"/></font></td>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template></font></td>
															</xsl:if>
															<xsl:if test="$showSizes = 'true'">
																<td nowrap="nowrap"><font size="-1"><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec</font></td>
															</xsl:if>
														</tr>
													</xsl:for-each>
												</table>
											</xsl:if>
										</xsl:if>
									</td>
								</xsl:if>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"Audit Summary"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"User : <xsl:value-of select="results/userCount"/> users."
				<xsl:if test="$showUploads = 'true'">
					,"Uploads : <xsl:value-of select="results/uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/uploadBytes" /></xsl:call-template> total."
				</xsl:if>
				<xsl:if test="$showDownloads = 'true'">
					,"Downloads : <xsl:value-of select="results/downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/downloadBytes" /></xsl:call-template> total."
				</xsl:if>
				<xsl:if test="$showDeletes = 'true'">
					,"Deletes : <xsl:value-of select="results/deleteCount"/> deletes, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="results/deleteBytes" /></xsl:call-template> total."
				</xsl:if>
				<xsl:if test="$showRenames = 'true'">
					,"Renames : <xsl:value-of select="results/renameCount"/> renames."
				</xsl:if>
				<br/>
				<xsl:for-each select="results/summary/summary_subitem">
					"<xsl:value-of select="username"/>"
					<xsl:if test="$showUploads = 'true'">
						,"<xsl:value-of select="uploadCount"/> uploads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template> total."
					</xsl:if>
					<xsl:if test="$showDownloads = 'true'">
						,"<xsl:value-of select="downloadCount"/> downloads, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template> total."
					</xsl:if>
					<xsl:if test="$showDeletes = 'true'">
						,"<xsl:value-of select="deleteCount"/> deletes, <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="deleteBytes" /></xsl:call-template> total."
					</xsl:if>
					<xsl:if test="$showRenames = 'true'">
						,"<xsl:value-of select="renameCount"/> renames."
					</xsl:if>
					<br/>
					<xsl:if test="$showFiles = 'true'">
						<xsl:if test="uploadCount != '0'">
							"Username"
							,"Action"
							<xsl:if test="$showDates = 'true'">
								,"Date"
							</xsl:if>
							<xsl:if test="$showIPs = 'true'">
								,"IP"
							</xsl:if>
							<xsl:if test="$showPaths = 'true'">
								,"Path"
							</xsl:if>
							,"File"
							<xsl:if test="$showSizes = 'true'">
								,"Size"
								,"Speed"
							</xsl:if>
							<br/>

							<xsl:for-each select="uploads/uploads_subitem">
								"<xsl:value-of select="username"/>"
								,"Upload"
								<xsl:if test="$showDates = 'true'">
									,"<xsl:value-of select="date"/>"
								</xsl:if>
								<xsl:if test="$showIPs = 'true'">
									,"<xsl:value-of select="ip"/>"
								</xsl:if>
								<xsl:if test="$showPaths = 'true'">
									,"<xsl:value-of select="path"/>"
								</xsl:if>
								,"<xsl:value-of select="name"/>"
								<xsl:if test="$showSizes = 'true'">
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec"
								</xsl:if>
								<br/>
							</xsl:for-each>
						</xsl:if>
					</xsl:if>
					<xsl:if test="$showFiles = 'true'">
						<xsl:if test="downloadCount != '0'">
							"Username"
							,"Action"
							<xsl:if test="$showDates = 'true'">
								,"Date"
							</xsl:if>
							<xsl:if test="$showIPs = 'true'">
								,"IP"
							</xsl:if>
							<xsl:if test="$showPaths = 'true'">
								,"Path"
							</xsl:if>
							,"File"
							<xsl:if test="$showSizes = 'true'">
								,"Size"
								,"Speed"
							</xsl:if>
							<br/>

							<xsl:for-each select="downloads/downloads_subitem">
								"<xsl:value-of select="username"/>"
								,"Download"
								<xsl:if test="$showDates = 'true'">
									,"<xsl:value-of select="date"/>"
								</xsl:if>
								<xsl:if test="$showIPs = 'true'">
									,"<xsl:value-of select="ip"/>"
								</xsl:if>
								<xsl:if test="$showPaths = 'true'">
									,"<xsl:value-of select="path"/>"
								</xsl:if>
								,"<xsl:value-of select="name"/>"
								<xsl:if test="$showSizes = 'true'">
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec"
								</xsl:if>
								<br/>
							</xsl:for-each>
						</xsl:if>
					</xsl:if>
					<xsl:if test="$showFiles = 'true'">
						<xsl:if test="deleteCount != '0'">
							"Username"
							,"Action"
							<xsl:if test="$showDates = 'true'">
								,"Date"
							</xsl:if>
							<xsl:if test="$showIPs = 'true'">
								,"IP"
							</xsl:if>
							<xsl:if test="$showPaths = 'true'">
								,"Path"
							</xsl:if>
							,"File"
							<xsl:if test="$showSizes = 'true'">
								,"Size"
								,"Speed"
							</xsl:if>
							<br/>

							<xsl:for-each select="deletes/deletes_subitem">
								"<xsl:value-of select="username"/>"
								,"Delete"
								<xsl:if test="$showDates = 'true'">
									,"<xsl:value-of select="date"/>"
								</xsl:if>
								<xsl:if test="$showIPs = 'true'">
									,"<xsl:value-of select="ip"/>"
								</xsl:if>
								<xsl:if test="$showPaths = 'true'">
									,"<xsl:value-of select="path"/>"
								</xsl:if>
								,"<xsl:value-of select="name"/>"
								<xsl:if test="$showSizes = 'true'">
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec"
								</xsl:if>
								<br/>
							</xsl:for-each>
						</xsl:if>
					</xsl:if>
					<xsl:if test="$showFiles = 'true'">
						<xsl:if test="renameCount != '0'">
							"Username"
							,"Action"
							<xsl:if test="$showDates = 'true'">
								,"Date"
							</xsl:if>
							<xsl:if test="$showIPs = 'true'">
								,"IP"
							</xsl:if>
							<xsl:if test="$showPaths = 'true'">
								,"Path"
							</xsl:if>
							,"File"
							<xsl:if test="$showSizes = 'true'">
								,"Size"
								,"Speed"
							</xsl:if>
							<br/>

							<xsl:for-each select="renames/renames_subitem">
								"<xsl:value-of select="username"/>"
								,"Rename"
								<xsl:if test="$showDates = 'true'">
									,"<xsl:value-of select="date"/>"
								</xsl:if>
								<xsl:if test="$showIPs = 'true'">
									,"<xsl:value-of select="ip"/>"
								</xsl:if>
								<xsl:if test="$showPaths = 'true'">
									,"<xsl:value-of select="path"/>"
								</xsl:if>
								,"<xsl:value-of select="name"/>"
								<xsl:if test="$showSizes = 'true'">
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="size" /></xsl:call-template>"
									,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="speed" /></xsl:call-template>/sec"
								</xsl:if>
								<br/>
							</xsl:for-each>
						</xsl:if>
					</xsl:if>
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