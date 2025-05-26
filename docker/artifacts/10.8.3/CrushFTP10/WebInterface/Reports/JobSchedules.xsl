<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Job Schedules</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Job Schedules</b></center>
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
						</tr>
						<xsl:for-each select="results/jobs/jobs_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleName"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleType"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="nextRun"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="jobEnabled"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="scheduleNote"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"Job Schedules"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Job"
				,"Type"
				,"Next Run"
				,"Enabled"
				,"Notes"
				<br/>
				<xsl:for-each select="results/jobs/jobs_subitem">
					,"<xsl:value-of select="scheduleName"/>"
					,"<xsl:value-of select="scheduleType"/>"
					,"<xsl:value-of select="nextRun"/>"
					,"<xsl:value-of select="jobEnabled"/>"
					,"<xsl:value-of select="scheduleNote"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>