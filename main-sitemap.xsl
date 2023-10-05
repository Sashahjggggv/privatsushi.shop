<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="2.0"
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:kml="http://www.opengis.net/kml/2.2"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<xsl:choose>
					<xsl:when test="kml:kml">
						<title>Розташування Sitemap - Monosushi</title>
					</xsl:when>
					<xsl:otherwise>
						<title>XML Sitemap - Monosushi</title>
					</xsl:otherwise>
				</xsl:choose>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body {
						font-size: 14px;
						font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
						margin: 0;
						color: #545353;
					}
					a {
						color: #05809e;
						text-decoration: none;
					}
					h1 {
						font-size: 24px;
						font-family: Verdana,Geneva,sans-serif;
						font-weight: normal;
						margin: 0;
					}

					#description {
						background-color: #4275f4;
						padding: 20px 40px;
						color: #fff;
						padding: 30px 30px 20px;
					}
					#description h1,
					#description p,
					#description a {
						color: #fff;
						margin: 0;
						font-size: 1.1em;
					}
					#description h1 {
						font-size: 2em;
						margin-bottom: 1em;
					}
					#description p {
						margin-top: 5px;
					}
					#description a {
						border-bottom: 1px dotted;
					}

					#content {
						padding: 20px 30px;
						background: #fff;
						max-width: 75%;
						margin: 0 auto;
					}
					table {
						border: none;
						border-collapse: collapse;
						font-size: .9em;
						width: 100%;
					}
					th {
						background-color: #4275f4;
						color: #fff;
						text-align: left;
						padding: 15px 10px;
						font-size: 14px;
						cursor: pointer;
					}
					td {
						padding: 10px;
						border-bottom: 1px solid #ddd;
					}
					tbody tr:nth-child(even) {
						background-color: #f7f7f7;
					}
					table td a {
						display: block;
					}
					table td a img {
						max-height: 30px;
						margin: 6px 3px;
					}
				</style>
			</head>
			<body>

				<xsl:choose>
					<xsl:when test="kml:kml">

						<div id="description">

							<h1>Файл KML</h1>

															<p>
									Цей файл KML створено <a href="https://rankmath.com/" target="_blank">Rank Math WordPress SEO Plugin</a>. Він використовується для надання інформації про місцезнаходження у Google.								</p>
							
							<p>
								Докладніше про <a href="https://developers.google.com/kml/documentation/" target="_blank">файл KML</a>.							</p>

						</div>

						<div id="content">
							<p class="expl">
								This KML file contains <xsl:value-of select="count(kml:kml/kml:Document/kml:Folder/kml:Placemark)"/> Locations.
							</p>
							<p class="expl">
								<a href="https://monosushi.com.ua/sitemap_index.xml">&#8592; Sitemap Index</a>							</p>
							<table id="sitemap" cellpadding="3">
								<thead>
									<tr>
										<th width="25%">Ім&#039;я</th>
										<th width="40%">Адреса</th>
										<th width="15%">Номер телефону</th>
										<th width="10%">Широта</th>
										<th width="10%">Довгота</th>
									</tr>
								</thead>
								<tbody>
									<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
									<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
									<xsl:for-each select="kml:kml/kml:Document/kml:Folder/kml:Placemark">
										<tr>
											<td>
												<xsl:variable name="itemURL">
													<xsl:value-of select="atom:link/@href"/>
												</xsl:variable>
												<a href="{$itemURL}">
													<xsl:value-of select="kml:name"/>
												</a>
											</td>
											<td>
												<xsl:value-of select="kml:address"/>
											</td>
											<td>
												<xsl:value-of select="kml:phoneNumber"/>
											</td>
											<td>
												<xsl:value-of select="kml:LookAt/kml:latitude"/>
											</td>
											<td>
												<xsl:value-of select="kml:LookAt/kml:longitude"/>
											</td>
										</tr>
									</xsl:for-each>
								</tbody>
							</table>
						</div>
					</xsl:when>
					<xsl:otherwise>

						<div id="description">

							<h1>XML Sitemap</h1>

															<p>
									Цей XML Sitemap згенеровано <a href="https://rankmath.com/" target="_blank">Plugin Rank Math WordPress SEO</a>. Це те, що використовують пошукові системи, такі як Google, для сканування та повторного сканування записів/сторінок/товарів/зображень/архівів на вашому веб-сайті.								</p>
							
							<p>
								Докладніше про <a href="http://sitemaps.org" target="_blank">XML Sitemaps</a>.							</p>

						</div>

						<div id="content">
							<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">

								<p>
									Цей файл Sitemap Index XML містить <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sitemaps.								</p>

								<table id="sitemap" cellpadding="3">

									<thead>
										<tr>
											<th width="75%">Sitemap</th>
											<th width="25%">Остання зміна</th>
										</tr>
									</thead>

									<tbody>
										<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
											<xsl:variable name="sitemapURL">
												<xsl:value-of select="sitemap:loc"/>
											</xsl:variable>
											<tr>
												<td>
													<a href="{$sitemapURL}"><xsl:value-of select="sitemap:loc"/></a>
												</td>
												<td>
													<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
												</td>
											</tr>
										</xsl:for-each>
									</tbody>

								</table>

							</xsl:if>
							<xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
								<p>
									Цей XML Sitemap містить <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URL-адрес.								</p>

								<p class="expl">
									<a href="https://monosushi.com.ua/sitemap_index.xml">&#8592; Sitemap Index</a>								</p>

								<table id="sitemap" cellpadding="3">

									<thead>
										<tr>
											<th width="75%">URL-адреса</th>
											<th width="5%">Зображення</th>											<th title="Last Modification Time" width="20%">Остання зміна.</th>
										</tr>
									</thead>

									<tbody>
										<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
										<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
										<xsl:for-each select="sitemap:urlset/sitemap:url">
											<tr>
												<td>
													<xsl:variable name="itemURL">
														<xsl:value-of select="sitemap:loc"/>
													</xsl:variable>
													<a href="{$itemURL}">
														<xsl:value-of select="sitemap:loc"/>
													</a>
												</td>
																								<td>
													<xsl:value-of select="count(image:image)"/>
												</td>
																								<td>
													<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
												</td>
											</tr>
										</xsl:for-each>
									</tbody>

								</table>

							</xsl:if>
						</div>
					</xsl:otherwise>
				</xsl:choose>

			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
