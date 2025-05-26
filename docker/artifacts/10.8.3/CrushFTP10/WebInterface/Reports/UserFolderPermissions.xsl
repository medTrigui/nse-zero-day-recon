<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>User Folder Permissions</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>User Folder Permissions</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Enabled</b></td>
							<td><b>Groups</b></td>
							<td><b>Notes</b></td>
							<td><b>Email</b></td>
							<td><b>Folder</b></td>
							<td><b>Location</b></td>
							<td><b>Permissions</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="enabled"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="groups"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="notes"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="email"/></td>
								<td nowrap="nowrap" valign="top" colspan="3"><xsl:value-of select="site_privs"/> - <xsl:value-of select="allowed_protocols"/></td>
							</tr>
							<xsl:for-each select="listing/listing_subitem">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="name"/></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="url"/></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="privs"/></td>
								</tr>
							</xsl:for-each>
							<tr>
								<td></td>
								<td colspan="4"><hr/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"User Folder Permissions"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Enabled"
				,"Groups"
				,"Notes"
				,"Email"
				,"Folder"
				,"Location"
				,"Permissions"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					<xsl:choose>
						<xsl:when test="listing/listing_subitem">
							<xsl:for-each select="listing/listing_subitem">
								,"<xsl:value-of select="../../username"/>"
								,"<xsl:value-of select="../../enabled"/>"
								,"<xsl:value-of select="../../groups"/>"
								,"<xsl:value-of select="../../notes"/>"
								,"<xsl:value-of select="../../email"/>"
								,"<xsl:value-of select="../../site_privs"/> - <xsl:value-of select="../../allowed_protocols"/>"
								,"<xsl:value-of select="name"/>"
								,"<xsl:value-of select="url"/>"
								,"<xsl:value-of select="privs"/>"
								<br/>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
								,"<xsl:value-of select="username"/>"
								,"<xsl:value-of select="enabled"/>"
								,"<xsl:value-of select="groups"/>"
								,"<xsl:value-of select="site_privs"/>"
								,"<xsl:value-of select="allowed_protocols"/>"
								<br/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>