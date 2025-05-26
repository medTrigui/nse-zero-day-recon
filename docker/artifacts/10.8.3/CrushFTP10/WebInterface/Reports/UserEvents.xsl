<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>User Events</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>User Events</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Groups</b></td>
							<td><b>Events</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="groups"/></td>
							</tr>
							<xsl:for-each select="events/events_subitem">
								<tr>
									<td></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="name"/></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="event_plugin_list"/></td>
									<td nowrap="nowrap" valign="top"><xsl:value-of select="event_user_action_list"/></td>
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
				"User Events"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Groups"
				,"Events"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					<xsl:choose>
						<xsl:when test="events/events_subitem">
							<xsl:for-each select="events/events_subitem">
								,"<xsl:value-of select="../../username"/>"
								,"<xsl:value-of select="../../groups"/>"
								,"<xsl:value-of select="name"/>"
								,"<xsl:value-of select="event_plugin_list"/>"
								,"<xsl:value-of select="event_user_action_list"/>"
								<br/>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
								,"<xsl:value-of select="username"/>"
								,"<xsl:value-of select="groups"/>"
								<br/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>