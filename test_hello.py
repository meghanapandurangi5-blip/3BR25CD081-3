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

if __name__ == "__main__":
    unittest.main()
