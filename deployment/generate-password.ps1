# Generate secure password for AWS RDS
param(
    [int]$Length = 16
)

$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
$password = ''
for($i=0; $i -lt $Length; $i++) {
    $password += $chars[(Get-Random -Maximum $chars.Length)]
}
Write-Output $password
