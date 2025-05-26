<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Job Destinations</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Job Destinations</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Job</b></td>
							<td><b>Type</b></td>
							<td><b>Next Run</b></td>
							<td><b>Enabled</b></td>
							<td><b>Notes</b></td>
							<td colspan="10"><b>Job Info</b></td>
						</tr>
						<xsl:for-each select="results/jobs/jobs_subitem/tasks/tasks_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleName"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleType"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="nextRun"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="jobEnabled"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleNote"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="type"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="name"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="findFilter"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="depth"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="findUrl"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="filePath"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="destUrl"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="destPath"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="emailFrom"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="emailTo"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"Job Destinations"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Job"
				,"Type"
				,"Next Run"
				,"Enabled"
				,"Notes"
				,"Job Info"
				<br/>
				<xsl:for-each select="results/jobs/jobs_subitem/tasks/tasks_subitem">
					"<xsl:value-of select="scheduleName"/>"
					,"<xsl:value-of select="scheduleType"/>"
					,"<xsl:value-of select="nextRun"/>"
					,"<xsl:value-of select="jobEnabled"/>"
					,"<xsl:value-of select="scheduleNote"/>"
					,"<xsl:value-of select="type"/>"
					,"<xsl:value-of select="name"/>"
					,"<xsl:value-of select="findFilter"/>"
					,"<xsl:value-of select="depth"/>"
					,"<xsl:value-of select="findUrl"/>"
					,"<xsl:value-of select="filePath"/>"
					,"<xsl:value-of select="destUrl"/>"
					,"<xsl:value-of select="destPath"/>"
					,"<xsl:value-of select="emailFrom"/>"
					,"<xsl:value-of select="emailTo"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>