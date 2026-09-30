import os
import subprocess
import sys
import unittest

class TestHelloWorld(unittest.TestCase):
    def test_hello_world_output(self):
        result = subprocess.run(
            [sys.executable, "hello.py"],
            capture_output=True,
            text=True,
            check=True
        )
        self.assertEqual(result.stdout.strip(), "Hello, World!")

    def test_c_hello_world_output(self):
        # Compile hello.c
        compile_result = subprocess.run(
            ["gcc", "hello.c", "-o", "hello_c"],
            capture_output=True,
            text=True
        )
        self.assertEqual(compile_result.returncode, 0, f"Compilation failed: {compile_result.stderr}")

        # Run compiled executable
        run_result = subprocess.run(
            ["./hello_c"],
            capture_output=True,
            text=True,
            check=True
        )
        self.assertEqual(run_result.stdout.strip(), "Hello, World!")

        # Clean up compiled artifact
        if os.path.exists("hello_c"):
            os.remove("hello_c")

if __name__ == "__main__":
    unittest.main()
