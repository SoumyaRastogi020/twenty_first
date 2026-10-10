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

Write-Host "`nDone. Then: git add assets/ ; git commit ; git push"
