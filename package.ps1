param([string]$packageName, $version="", $overwrite=$true)

$currentDir = [System.IO.Path]::GetDirectoryName($MyInvocation.Mycommand.Path)
$dest = "${currentDir}\releases\${packageName}.xpi"

if ([System.IO.File]::Exists($dest) -and $overwrite) {
	[System.IO.File]::Delete($dest)
}

cp -Path .\src\chrome\skin\tab-wheel-scroll-icon.png -Destination .\src\icon.png

cd src
$7zip = "C:\Program Files\7-Zip\7z.exe"
& "${7zip}" u -r -x@".\..\package-excluded.lst" -tzip $dest ".\*"
cd ..

rm .\src\icon.png