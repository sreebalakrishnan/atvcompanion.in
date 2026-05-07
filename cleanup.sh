cd "/Users/sreeb/Documents/Claude/Projects/sample-astrology"

# Step 1 — confirm count before deleting
echo "Conflict files about to be deleted:"
find . -type f -name "* 2.*" ! -path "./.git/*" | wc -l

# Step 2 — delete them all (working tree)
find . -type f -name "* 2.*" ! -path "./.git/*" -delete

# Step 3 — also remove from git tracking (they were committed)
git rm -r --cached --ignore-unmatch "*/* 2.*" "* 2.*" 2>/dev/null
# Belt-and-suspenders: explicit list of the top-level four
git rm --cached --ignore-unmatch "astronomy 2.html" "mercury-spectrum 2.html" "release-notes 2.html" "version 2.json" 2>/dev/null

# Step 4 — confirm none left
echo ""
echo "After cleanup:"
find . -type f -name "* 2.*" ! -path "./.git/*" | wc -l

# Step 5 — ship the cleanup
./ship.sh "cleanup iCloud sync-conflict duplicates"
