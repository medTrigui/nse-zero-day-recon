<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				"CurrentLogins"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				<xsl:variable name="showFiles"><xsl:value-of select="results/showFiles"/></xsl:variable>
				"Date","User","IP","Status","Uploads",,,"Downloads"<br/>
				<xsl:for-each select="results/recent_users/recent_users_subitem">
					<xsl:if test="string-length(normalize-space(user_name)) &gt; 0">
						"<xsl:value-of select="login_date_formatted"/>","<xsl:value-of select="user_name"/>","<xsl:value-of select="user_protocol"/>:<xsl:value-of select="user_ip"/>",
							<xsl:choose>
								<xsl:when test="status = 'active'">
									<xsl:choose>
										<xsl:when test="receiving_file = 'true'">"Uploading <xsl:value-of select="last_file_name"/>",</xsl:when>
										<xsl:when test="sending_file = 'true'">"Downloading <xsl:value-of select="last_file_name"/>",</xsl:when>
										<xsl:otherwise>"Idle",</xsl:otherwise>
									</xsl:choose>
									<xsl:choose>
										<xsl:when test="seconds_remaining &gt; 0">" : <xsl:value-of select="seconds_remaining"/> seconds remaining.",</xsl:when>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>"Disconnected",</xsl:otherwise>
							</xsl:choose>
						"<xsl:value-of select="session_upload_count"/>",,,"<xsl:value-of select="session_download_count"/>"
						<br/>
						<xsl:choose>
							<xsl:when test="session_upload_count &gt; 0">
								<xsl:if test="$showFiles = 'true'">
									,,,,"Date","File","Speed"<br/>
									<xsl:for-each select="session_commands/session_commands_subitem[the_command='STOR']">
										,,,,"<xsl:value-of select="substring-after(user_time,' ')"/>","<xsl:value-of select="the_file_path"/><xsl:value-of select="the_file_name"/>","(<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_size" /></xsl:call-template> @ <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_speed" /></xsl:call-template>/sec)"<br/>
									</xsl:for-each>
								</xsl:if>
							</xsl:when>
						</xsl:choose>
						<xsl:choose>
							<xsl:when test="session_download_count &gt; 0">
								<xsl:if test="$showFiles = 'true'">
									,,,,,,,"Date","File","Speed"<br/>
									<xsl:for-each select="session_commands/session_commands_subitem[the_command='RETR']">
										,,,,,,,"<xsl:value-of select="substring-after(user_time,' ')"/>","<xsl:value-of select="the_file_path"/><xsl:value-of select="the_file_name"/>","(<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_size" /></xsl:call-template> @ <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_speed" /></xsl:call-template>/sec)"<br/>
									</xsl:for-each>
								</xsl:if>
							</xsl:when>
						</xsl:choose>
					</xsl:if>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Current Logins</title>
				</head>
				<xsl:variable name="showFiles"><xsl:value-of select="results/showFiles"/></xsl:variable>
				<body bgcolor="#CCCCCC">
					<center><b>Current Logins</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table border="0" cellspacing="0" cellpadding="5">
						<tr>
							<td><b>Date</b></td>
							<td><b>User</b></td>
							<td><b>IP</b></td>
							<td><b>Status</b></td>
							<td><b>Uploads</b></td>
							<td><b>Downloads</b></td>
						</tr>
						<xsl:for-each select="results/recent_users/recent_users_subitem">
							<xsl:if test="string-length(normalize-space(user_name)) &gt; 0">
								<tr>
									<td nowrap="nowrap" valign="top">
										<xsl:value-of select="login_date_formatted"/>
									</td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="user_name"/></td>
									<td nowrap="nowrap" valign="top">
										<xsl:value-of select="user_protocol"/>:<xsl:value-of select="user_ip"/>
									</td>
									<td nowrap="nowrap" valign="top">
										<xsl:choose>
											<xsl:when test="status = 'active'">
												<xsl:choose>
													<xsl:when test="receiving_file = 'true'">Uploading <xsl:value-of select="last_file_name"/></xsl:when>
													<xsl:when test="sending_file = 'true'">Downloading <xsl:value-of select="last_file_name"/></xsl:when>
													<xsl:otherwise>Idle</xsl:otherwise>
												</xsl:choose>
												<xsl:choose>
													<xsl:when test="seconds_remaining &gt; 0"> : <xsl:value-of select="seconds_remaining"/> seconds remaining.</xsl:when>
												</xsl:choose>
											</xsl:when>
											<xsl:otherwise>Disconnected</xsl:otherwise>
										</xsl:choose>
									</td>
									<td nowrap="nowrap" valign="top">
										<xsl:value-of select="session_upload_count"/>
										<xsl:choose>
											<xsl:when test="session_upload_count &gt; 0">
												<xsl:if test="$showFiles = 'true'">
													<table cellpadding="5"><tr><td>
														<table border="0" cellspacing="0" cellpadding="5">
															<tr>
																<td><font size="-2"><b>Date</b></font></td>
																<td><font size="-2"><b>File</b></font></td>
																<td><font size="-2"><b>Speed</b></font></td>
															</tr>
															<xsl:for-each select="session_commands/session_commands_subitem[the_command='STOR']">
																<tr>
																	<td nowrap="nowrap"><font size="-2"><xsl:value-of select="substring-after(user_time,' ')"/></font></td>
																	<td nowrap="nowrap"><font size="-2"><xsl:value-of select="the_file_path"/><xsl:value-of select="the_file_name"/></font></td>
																	<td nowrap="nowrap"><font size="-2">(<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_size" /></xsl:call-template> @ <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_speed" /></xsl:call-template>/sec)</font></td>
																</tr>
															</xsl:for-each>
														</table>
													</td></tr></table>
												</xsl:if>
											</xsl:when>
											<xsl:otherwise><div></div></xsl:otherwise>
										</xsl:choose>
									</td>
									<td nowrap="nowrap" valign="top">
										<xsl:value-of select="session_download_count"/>
										<xsl:choose>
											<xsl:when test="session_download_count &gt; 0">
												<xsl:if test="$showFiles = 'true'">
													<table cellpadding="5"><tr><td>
														<table border="0" cellspacing="0" cellpadding="5">
															<tr>
																<td><font size="-2"><b>Date</b></font></td>
																<td><font size="-2"><b>File</b></font></td>
																<td><font size="-2"><b>Speed</b></font></td>
															</tr>
															<xsl:for-each select="session_commands/session_commands_subitem[the_command='RETR']">
																<tr>
																	<td nowrap="nowrap"><font size="-2"><xsl:value-of select="substring-after(user_time,' ')"/></font></td>
																	<td nowrap="nowrap"><font size="-2"><xsl:value-of select="the_file_path"/><xsl:value-of select="the_file_name"/></font></td>
																	<td nowrap="nowrap"><font size="-2">(<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_size" /></xsl:call-template> @ <xsl:call-template name="formatBytes"><xsl:with-param name="data" select="the_file_speed" /></xsl:call-template>/sec)</font></td>
																</tr>
															</xsl:for-each>
														</table>
													</td></tr></table>
												</xsl:if>
											</xsl:when>
											<xsl:otherwise><div></div></xsl:otherwise>
										</xsl:choose>
									</td>
								</tr>
							</xsl:if>
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