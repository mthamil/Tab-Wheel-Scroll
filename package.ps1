param([string]$packageName, $version="", $overwrite=$true)

function ZipFiles
{
	param([string]$archiveFileName, [string]$srcDirectory)

	Add-Type -Assembly System.IO.Compression.FileSystem
	$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
	[System.IO.Compression.ZipFile]::CreateFromDirectory($srcDirectory, $archiveFileName, $compressionLevel, $false)
}

$currentDir = [System.IO.Path]::GetDirectoryName($MyInvocation.Mycommand.Path)
$dest = "${currentDir}\releases\${packageName}.xpi"

if ([System.IO.File]::Exists($dest) -and $overwrite) {
	[System.IO.File]::Delete($dest)
}

cp -Path .\src\chrome\skin\tab-wheel-scroll-icon.png -Destination .\src\icon.png

ZipFiles $dest "${currentDir}\src"

rm .\src\icon.png