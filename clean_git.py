import shutil
import subprocess

repo_dir = r"C:\Users\ARIF\.gemini\antigravity\scratch\ai-peer-teaching-kit"
nested = r"C:\Users\ARIF\.gemini\antigravity\scratch\ai-peer-teaching-kit\vac repo"

shutil.rmtree(nested, ignore_errors=True)
subprocess.run(["git", "add", "-A"], cwd=repo_dir)
subprocess.run(["git", "commit", "-m", "Clean up duplicate nested directory"], cwd=repo_dir)
print("Git repository cleaned up cleanly!")
