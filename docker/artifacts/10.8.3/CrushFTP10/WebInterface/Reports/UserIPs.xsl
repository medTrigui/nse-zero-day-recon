<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showIPs"><xsl:value-of select="results/showIPs"/></xsl:variable>
				<xsl:variable name="reverseDNS"><xsl:value-of select="results/reverseDNS"/></xsl:variable>
				"User IPs (<xsl:value-of select="results/unique_ip_count"/> unique IPs)"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				<xsl:if test="$showCounts = 'true'">
					,"IP Count"
				</xsl:if>
				<xsl:if test="$showIPs = 'true'">
					,"IPs"
				</xsl:if>
				<br/>
				<xsl:for-each select="results/ips/ips_subitem">
					,"<xsl:value-of select="username"/>"
					<xsl:if test="$showCounts = 'true'">
						,"<xsl:value-of select="count"/>"
					</xsl:if>
					<xsl:if test="$showIPs = 'true'">
						,"
						<xsl:for-each select="*">
							<xsl:if test="name() = 'item'">
								<xsl:value-of select="@name"/> - <xsl:value-of select="."/> connections, 
							</xsl:if>
						</xsl:for-each>
						"
					</xsl:if>
					<br/>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showIPs"><xsl:value-of select="results/showIPs"/></xsl:variable>
				<xsl:variable name="reverseDNS"><xsl:value-of select="results/reverseDNS"/></xsl:variable>
				<head>
					<title>User IPs</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>User IPs (<xsl:value-of select="results/unique_ip_count"/> unique IPs)</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<xsl:if test="$showCounts = 'true'">
								<td><b>IP Count</b></td>
							</xsl:if>
							<xsl:if test="$showIPs = 'true'">
								<td><b>IPs</b></td>
							</xsl:if>
						</tr>
						<xsl:for-each select="results/ips/ips_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<xsl:if test="$showCounts = 'true'">
									<td valign="top"><xsl:value-of select="count"/></td>
								</xsl:if>
								<xsl:if test="$showIPs = 'true'">
									<td nowrap="nowrap" valign="top"> 
										<table cellpadding="0" cellspacing="0">
										<xsl:for-each select="*">
											<xsl:if test="name() = 'item'">
												<tr>
													<td width="100"><font size="-2"><xsl:value-of select="@name"/></font></td>
													<td><font size="-2"><xsl:value-of select="."/> connections</font></td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										</table>
									</td>
								</xsl:if>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>