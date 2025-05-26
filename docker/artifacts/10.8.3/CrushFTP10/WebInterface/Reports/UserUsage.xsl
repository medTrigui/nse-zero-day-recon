<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>User Usage</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>User Usage</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Enabled</b></td>
							<td nowrap="nowrap"><b>Last Login</b></td>
							<td><b>Groups</b></td>
							<td nowrap="nowrap"><b>Linked VFS</b></td>
							<td nowrap="nowrap"><b>Max Logins</b></td>
							<td nowrap="nowrap"><b>Account Expiration</b></td>
							<td nowrap="nowrap"><b>Password Expiration Enabled</b></td>
							<td nowrap="nowrap"><b>Password Expiration Days</b></td>
							<td nowrap="nowrap"><b>Password Expiration Date</b></td>
							<td><b>Folder</b></td>
							<td><b>Location</b></td>
							<td><b>Permissions</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="enabled"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="last_login"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="groups"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="linked_vfs"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="max_logins"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="account_expire"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="expire_password"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="expire_password_days"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="expire_password_when"/></td>
							</tr>
							<xsl:for-each select="listing/listing_subitem">
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
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
								<td colspan="12"><hr/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"User Usage"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Enabled"
				,"Last Login"
				,"Groups"
				,"Linked VFS"
				,"Max Logins"
				,"Account Expiration"
				,"Password Expiration Enabled"
				,"Password Expiration Days"
				,"Password Expiration When"
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
								,"<xsl:value-of select="../../last_login"/>"
								,"<xsl:value-of select="../../groups"/>"
								,"<xsl:value-of select="../../linked_vfs"/>"
								,"<xsl:value-of select="../../max_logins"/>"
								,"<xsl:value-of select="../../account_expire"/>"
								,"<xsl:value-of select="../../expire_password"/>"
								,"<xsl:value-of select="../../expire_password_days"/>"
								,"<xsl:value-of select="../../expire_password_when"/>"
								,"<xsl:value-of select="name"/>"
								,"<xsl:value-of select="url"/>"
								,"<xsl:value-of select="privs"/>"
								<br/>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
								,"<xsl:value-of select="username"/>"
								,"<xsl:value-of select="enabled"/>"
								,"<xsl:value-of select="last_login"/>"
								,"<xsl:value-of select="groups"/>"
								,"<xsl:value-of select="linked_vfs"/>"
								,"<xsl:value-of select="max_logins"/>"
								,"<xsl:value-of select="account_expire"/>"
								,"<xsl:value-of select="expire_password"/>"
								,"<xsl:value-of select="expire_password_days"/>"
								,"<xsl:value-of select="expire_password_when"/>"
								<br/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>