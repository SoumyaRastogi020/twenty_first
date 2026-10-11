# Re-copy compressed media from personal project_21 location folders
# into twenty_first/assets/ (same names the website uses).
# Run from anywhere:
#   powershell -File "c:\Users\74629\personal project_21\twenty_first\scripts\sync-media-from-folders.ps1"

$ErrorActionPreference = "Stop"
$base = "C:\Users\74629\personal project_21"
$proj = Join-Path $base "twenty_first\assets"

function Copy-IfExists($src, $dst) {
  if (Test-Path -LiteralPath $src) {
    Copy-Item -LiteralPath $src -Destination $dst -Force
    Write-Host "OK $dst"
  } else {
    Write-Warning "Missing: $src"
  }
}

# Ulwe  -> assets/ulwe/01.jpg, 01.mp4, ...
Copy-IfExists "$base\ulwe\ulwe (1).jpg" "$proj\ulwe\01.jpg"
Copy-IfExists "$base\ulwe\ulwe (1).mp4" "$proj\ulwe\01.mp4"
Copy-IfExists "$base\ulwe\ulwe (2).jpg" "$proj\ulwe\02.jpg"
Copy-IfExists "$base\ulwe\ulwe (2).mp4" "$proj\ulwe\02.mp4"
Copy-IfExists "$base\ulwe\ulwe (3).mp4" "$proj\ulwe\03.mp4"

# Marine Drive
Copy-IfExists "$base\marine drive\1 (1).jpg" "$proj\marine-drive\01.jpg"
Copy-IfExists "$base\marine drive\1 (1).mp4" "$proj\marine-drive\01.mp4"
Copy-IfExists "$base\marine drive\1 (2).jpg" "$proj\marine-drive\02.jpg"
Copy-IfExists "$base\marine drive\1 (1) (1).mp4" "$proj\marine-drive\02.mp4"

# Kala Ghoda
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (1).jpg" "$proj\kala-ghoda\01.jpg"
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (1).mp4" "$proj\kala-ghoda\01.mp4"
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (2).jpg" "$proj\kala-ghoda\02.jpg"
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (3).jpg" "$proj\kala-ghoda\03.jpg"
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (2).mp4" "$proj\kala-ghoda\02.mp4"
Copy-IfExists "$base\kala ghoda\kala ghoda 1 (4).jpg" "$proj\kala-ghoda\04.jpg"

# Lower Parel
Copy-IfExists "$base\lower parel\1 (1).jpg" "$proj\lower-parel\01.jpg"
Copy-IfExists "$base\lower parel\1 (2).jpg" "$proj\lower-parel\02.jpg"
Copy-IfExists "$base\lower parel\1 (3).jpg" "$proj\lower-parel\03.jpg"
Copy-IfExists "$base\lower parel\1 (1).mp4" "$proj\lower-parel\01.mp4"

# Mapro / Lonavla
Copy-IfExists "$base\lonavla\1 (1).jpg" "$proj\mapro-lonavla\01.jpg"
Copy-IfExists "$base\lonavla\1 (2).jpg" "$proj\mapro-lonavla\02.jpg"
Copy-IfExists "$base\lonavla\1 (1).mp4" "$proj\mapro-lonavla\01.mp4"

# Local train rides
Copy-IfExists "$base\train\train (1).jpg" "$proj\local-train-rides\01.jpg"
Copy-IfExists "$base\train\train (1).mp4" "$proj\local-train-rides\01.mp4"
Copy-IfExists "$base\train\train (2).jpg" "$proj\local-train-rides\02.jpg"
Copy-IfExists "$base\train\train (3).jpg" "$proj\local-train-rides\03.jpg"

# SGNP
Copy-IfExists "$base\sanjay gandhi\sgnp.jpg" "$proj\sgnp\01.jpg"
Copy-IfExists "$base\sanjay gandhi\sgnp.mp4" "$proj\sgnp\01.mp4"

# Santacruz Metro
Copy-IfExists "$base\santacruz\santacruz.jpg" "$proj\santacruz-metro\01.jpg"
Copy-IfExists "$base\santacruz\santacruz.mp4" "$proj\santacruz-metro\01.mp4"
Copy-IfExists "$base\santacruz\santacruz (2).jpg" "$proj\santacruz-metro\02.jpg"

# Borivali
Copy-IfExists "$base\borivali\borivali (1).jpg" "$proj\borivali\01.jpg"
Copy-IfExists "$base\borivali\borivali (2).jpg" "$proj\borivali\02.jpg"
Copy-IfExists "$base\borivali\borivali (3).jpg" "$proj\borivali\03.jpg"
Copy-IfExists "$base\borivali\borivali (1).mp4" "$proj\borivali\01.mp4"
Copy-IfExists "$base\borivali\borivali (2).mp4" "$proj\borivali\02.mp4"

# Crawford Market
Copy-IfExists "$base\crawford\crawford (1).jpg" "$proj\crawford-market\01.jpg"
Copy-IfExists "$base\crawford\crawford (2).jpg" "$proj\crawford-market\02.jpg"
Copy-IfExists "$base\crawford\crawford (3).jpg" "$proj\crawford-market\03.jpg"

# Imagica
Copy-IfExists "$base\imagica\imagica (1).jpg" "$proj\imagica\01.jpg"
Copy-IfExists "$base\imagica\imagica (2).jpg" "$proj\imagica\02.jpg"

# Mumbai Central
Copy-IfExists "$base\mumbai central\mumbai central 1 (1).jpg" "$proj\mumbai-central\01.jpg"
Copy-IfExists "$base\mumbai central\mumbai central 1 (2).jpg" "$proj\mumbai-central\02.jpg"
Copy-IfExists "$base\mumbai central\mumbai central 1 (3).jpg" "$proj\mumbai-central\03.jpg"
Copy-IfExists "$base\mumbai central\mumbai central 1 (4).jpg" "$proj\mumbai-central\04.jpg"

# Nashik
Copy-IfExists "$base\nashik\nashik (1).jpg" "$proj\nashik\01.jpg"
Copy-IfExists "$base\nashik\nashik (1).mp4" "$proj\nashik\01.mp4"
Copy-IfExists "$base\nashik\nashik (2).jpg" "$proj\nashik\02.jpg"
Copy-IfExists "$base\nashik\nashik (2).mp4" "$proj\nashik\02.mp4"
Copy-IfExists "$base\nashik\nashik (3).jpg" "$proj\nashik\03.jpg"

# Pune
Copy-IfExists "$base\pune\pune 1 (1).jpg" "$proj\pune\01.jpg"
Copy-IfExists "$base\pune\pune 1 (1).mp4" "$proj\pune\01.mp4"
Copy-IfExists "$base\pune\pune 1 (2).jpg" "$proj\pune\02.jpg"
Copy-IfExists "$base\pune\pune 1 (3).jpg" "$proj\pune\03.jpg"

# Fort
Copy-IfExists "$base\fort\fort (1).jpg" "$proj\fort\01.jpg"
Copy-IfExists "$base\fort\fort (1).mp4" "$proj\fort\01.mp4"
Copy-IfExists "$base\fort\fort (2).jpg" "$proj\fort\02.jpg"
Copy-IfExists "$base\fort\fort (2).mp4" "$proj\fort\02.mp4"

# St. Xavier's
Copy-IfExists "$base\xaviers\xaviers (1).jpg" "$proj\xaviers-college\01.jpg"
Copy-IfExists "$base\xaviers\xaviers (1).mp4" "$proj\xaviers-college\01.mp4"
Copy-IfExists "$base\xaviers\xaviers (2).jpg" "$proj\xaviers-college\02.jpg"
Copy-IfExists "$base\xaviers\xaviers (2).mp4" "$proj\xaviers-college\02.mp4"
Copy-IfExists "$base\xaviers\xaviers (3).jpg" "$proj\xaviers-college\03.jpg"
Copy-IfExists "$base\xaviers\xaviers (4).jpg" "$proj\xaviers-college\04.jpg"
Copy-IfExists "$base\xaviers\xaviers (5).jpg" "$proj\xaviers-college\05.jpg"

# Khar
Copy-IfExists "$base\khar\khar (1).jpg" "$proj\khar\01.jpg"
Copy-IfExists "$base\khar\khar (1).mp4" "$proj\khar\01.mp4"
Copy-IfExists "$base\khar\khar (2).jpg" "$proj\khar\02.jpg"
Copy-IfExists "$base\khar\khar (3).jpg" "$proj\khar\03.jpg"
Copy-IfExists "$base\khar\khar (4).jpg" "$proj\khar\04.jpg"

# Jogeshwari
Copy-IfExists "$base\jogeshwari\jogeshwari (1).jpg" "$proj\jogeshwari\01.jpg"
Copy-IfExists "$base\jogeshwari\jogeshwari (1).mp4" "$proj\jogeshwari\01.mp4"
Copy-IfExists "$base\jogeshwari\jogeshwari (2).mp4" "$proj\jogeshwari\02.mp4"

# Charni Road
Copy-IfExists "$base\charni road\charni road (1).jpg" "$proj\charni-road\01.jpg"
Copy-IfExists "$base\charni road\charni road (1).mp4" "$proj\charni-road\01.mp4"
Copy-IfExists "$base\charni road\charni road (2).jpg" "$proj\charni-road\02.jpg"
Copy-IfExists "$base\charni road\charni road (3).jpg" "$proj\charni-road\03.jpg"

# Bandra
Copy-IfExists "$base\bandra\bandra (1).mp4" "$proj\bandra\01.mp4"
Copy-IfExists "$base\bandra\bandra (2).mp4" "$proj\bandra\02.mp4"

# Colaba Causeway
Copy-IfExists "$base\colaba\colaba (1).jpg" "$proj\colaba-causeway\01.jpg"
Copy-IfExists "$base\colaba\colaba (2).jpg" "$proj\colaba-causeway\02.jpg"

Write-Host "`nDone. Then: git add assets/ data/locations.js ; git commit ; git push"
