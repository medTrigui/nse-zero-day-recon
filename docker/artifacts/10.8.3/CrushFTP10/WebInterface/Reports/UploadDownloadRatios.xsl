<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showBytes"><xsl:value-of select="results/showBytes"/></xsl:variable>
				"Upload Download Ratios"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Username"
				<xsl:if test="$showCounts = 'true'">
					,"Upload Count"
					,"Download Count"
				</xsl:if>
				<xsl:if test="$showBytes = 'true'">
					,"Upload Bytes"
					,"Download Bytes"
				</xsl:if>
				<br/>
				<xsl:for-each select="results/ratios/ratios_subitem">
					"<xsl:value-of select="username"/>"
					<xsl:if test="$showCounts = 'true'">
						,"<xsl:value-of select="uploadCount"/>"
						,"<xsl:value-of select="downloadCount"/>"
					</xsl:if>
					<xsl:if test="$showBytes = 'true'">
						,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template>"
						,"<xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template>"
					</xsl:if>
					<br/>
					<xsl:if test="$showCounts = 'true'">
						,"<xsl:if test="uploadCount &lt; downloadCount">
							<xsl:value-of select="format-number(floor((uploadCount div downloadCount) * 100),'####.#')"/>% upload,
							<xsl:value-of select="format-number(100 - floor((uploadCount div downloadCount) * 100),'####.#')"/>% download.
						</xsl:if>
						<xsl:if test="uploadCount &gt; downloadCount">
							<xsl:value-of select="format-number(100 - floor((downloadCount div uploadCount) * 100),'####.#')"/>% upload,
							<xsl:value-of select="format-number(floor((downloadCount div uploadCount) * 100),'####.#')"/>% download.
						</xsl:if>
						"
					</xsl:if>
					<xsl:if test="$showBytes = 'true'">
						,"
						<xsl:if test="uploadBytes &lt; downloadBytes">
							<xsl:value-of select="format-number(floor((uploadBytes div downloadBytes) * 1000) div 10,'####.#')"/>% upload,
							<xsl:value-of select="format-number(100 - floor((uploadBytes div downloadBytes) * 1000) div 10,'####.#')"/>% download.
						</xsl:if>
						<xsl:if test="uploadBytes &gt; downloadBytes">
							<xsl:value-of select="format-number(100 - floor((downloadBytes div uploadBytes) * 1000) div 10,'####.#')"/>% upload,
							<xsl:value-of select="format-number(floor((downloadBytes div uploadBytes) * 1000) div 10,'####.#')"/>% download.
						</xsl:if>
						"
					</xsl:if>
					<br/>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<xsl:variable name="showCounts"><xsl:value-of select="results/showCounts"/></xsl:variable>
				<xsl:variable name="showBytes"><xsl:value-of select="results/showBytes"/></xsl:variable>
				<head>
					<title>Upload Download Ratios</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Upload Download Ratios</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<xsl:if test="$showCounts = 'true'">
								<td><b>Upload Count</b></td>
								<td><b>Download Count</b></td>
							</xsl:if>
							<xsl:if test="$showBytes = 'true'">
								<td><b>Upload Bytes</b></td>
								<td><b>Download Bytes</b></td>
							</xsl:if>
						</tr>
						<xsl:for-each select="results/ratios/ratios_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap"><xsl:value-of select="username"/></td>
								<xsl:if test="$showCounts = 'true'">
									<td><xsl:value-of select="uploadCount"/></td>
									<td><xsl:value-of select="downloadCount"/></td>
								</xsl:if>
								<xsl:if test="$showBytes = 'true'">
									<td><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="uploadBytes" /></xsl:call-template></td>
									<td><xsl:call-template name="formatBytes"><xsl:with-param name="data" select="downloadBytes" /></xsl:call-template></td>
								</xsl:if>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td colspan="2">
									<xsl:if test="$showCounts = 'true'">
										<xsl:if test="uploadCount &lt; downloadCount">
											<xsl:value-of select="format-number((floor((uploadCount div downloadCount) * 100)),'####.#')"/>% upload,
											<xsl:value-of select="format-number((100 - floor((uploadCount div downloadCount) * 100)),'####.#')"/>% download.
										</xsl:if>
										<xsl:if test="uploadCount &gt; downloadCount">
											<xsl:value-of select="format-number((100 - floor((downloadCount div uploadCount) * 100)),'####.#')"/>% upload,
											<xsl:value-of select="format-number((floor((downloadCount div uploadCount) * 100)),'####.#')"/>% download.
										</xsl:if>
									</xsl:if>
								</td>
								<td colspan="2">
									<xsl:if test="$showBytes = 'true'">
										<xsl:if test="uploadBytes &lt; downloadBytes">
											<xsl:value-of select="format-number((floor((uploadBytes div downloadBytes) * 1000) div 10),'####.#')"/>% upload,
											<xsl:value-of select="format-number((100 - floor((uploadBytes div downloadBytes) * 1000) div 10),'####.#')"/>% download.
										</xsl:if>
										<xsl:if test="uploadBytes &gt; downloadBytes">
											<xsl:value-of select="format-number((100 - floor((downloadBytes div uploadBytes) * 1000) div 10),'####.#')"/>% upload,
											<xsl:value-of select="format-number((floor((downloadBytes div uploadBytes) * 1000) div 10),'####.#')"/>% download.
										</xsl:if>
									</xsl:if>
								</td>
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