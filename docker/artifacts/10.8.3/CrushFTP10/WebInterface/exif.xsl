<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<body>
				<table>
					<xsl:if test="string-length(normalize-space(MetaData/Directory/DateTime)) != 0">
						<tr>
							<td align="right"><b>Date Time :</b></td><td><xsl:value-of select="MetaData/Directory/DateTime"/></td>
						</tr>
						<tr>
							<td align="right"><b>Size :</b></td><td><xsl:value-of select="MetaData/Directory/ImageWidth"/> by <xsl:value-of select="MetaData/Directory/ImageLength"/></td>
						</tr>
						<tr>
							<td align="right"><b>Model :</b></td><td><xsl:value-of select="MetaData/Directory/Make"/> : <xsl:value-of select="MetaData/Directory/Model"/></td>
						</tr>
						<tr>
							<td align="right"><b>Resolution :</b></td><td><xsl:value-of select="MetaData/Directory/XResolution"/> ppi by <xsl:value-of select="MetaData/Directory/YResolution"/> ppi</td>
						</tr>
						<tr>
							<td align="right"><b>Color Mode :</b></td><td><xsl:value-of select="MetaData/Directory/ColorSpace"/></td>
						</tr>
					</xsl:if>
					<xsl:if test="string-length(normalize-space(MetaData/Directory/ImageDescription)) != 0">
						<tr>
							<td align="right"><b>Description :</b></td><td><xsl:value-of select="MetaData/Directory/ImageDescription"/>%</td>
						</tr>
					</xsl:if>
					<xsl:if test="string-length(normalize-space(MetaData/Directory/Class)) != 0">
						<tr>
							<td align="right"><b>Size :</b></td><td><xsl:value-of select="substring-before(MetaData/Directory/Geometry,'+')"/></td>
						</tr>
						<tr>
							<td align="right"><b>Resolution :</b></td><td><xsl:value-of select="substring-before(MetaData/Directory/Resolution,'x')"/>ppi x <xsl:value-of select="substring-after(MetaData/Directory/Resolution,'x')"/>ppi</td>
						</tr>
						<tr>
							<td align="right"><b>Color Mode :</b></td><td><xsl:value-of select="MetaData/Directory/ColorSpace"/></td>
						</tr>
						<tr>
							<td align="right"><b>Depth :</b></td><td><xsl:value-of select="MetaData/Directory/Depth"/></td>
						</tr>
						<xsl:if test="string-length(normalize-space(MetaData/Directory/Quality)) != 0">
							<tr>
								<td align="right"><b>Quality :</b></td><td><xsl:value-of select="MetaData/Directory/Quality"/>%</td>
							</tr>
						</xsl:if>
						<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff)) != 0">
							<tr>
								<td align="right" valign="top"><b>Other :</b></td>
								<td>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[1])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[1]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[2])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[2]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[3])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[3]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[4])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[4]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[5])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[5]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[6])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[6]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[7])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[7]"/><br/></xsl:if>
									<xsl:if test="string-length(normalize-space(MetaData/Directory/Tiff[8])) != 0"><xsl:value-of select="MetaData/Directory/Tiff[8]"/><br/></xsl:if>
								</td>
							</tr>
						</xsl:if>
					</xsl:if>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:transform>
