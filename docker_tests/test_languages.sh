#!/bin/zsh
# OR use #!/bin/bash if you prefer bash

# Multi-language test script for Docker

IMAGE="multi-lang-env"

# Directory for temp code inside container
TMP_DIR="/tmp/test_code"

mkdir -p $TMP_DIR

# ----------- Python -----------
echo "Testing Python..."
docker run --rm -i $IMAGE bash -c "echo 'print(\"Hello Python!\")' > $TMP_DIR/test.py && python3 $TMP_DIR/test.py"

# ----------- C -----------
echo "Testing C..."
docker run --rm -i $IMAGE bash -c "cat > $TMP_DIR/test.c << 'EOF'
#include <stdio.h>
int main() {
    printf(\"Hello C!\\n\");
    return 0;
}
EOF
gcc $TMP_DIR/test.c -o $TMP_DIR/a.out && $TMP_DIR/a.out"

# ----------- C++ -----------
echo "Testing C++..."
docker run --rm -i $IMAGE bash -c "cat > $TMP_DIR/test.cpp << 'EOF'
#include <iostream>
int main() {
    std::cout << \"Hello C++\" << std::endl;
    return 0;
}
EOF
g++ $TMP_DIR/test.cpp -o $TMP_DIR/a.out && $TMP_DIR/a.out"

# ----------- Java -----------
echo "Testing Java..."
docker run --rm -i $IMAGE bash -c "cat > $TMP_DIR/Test.java << 'EOF'
public class Test {
    public static void main(String[] args) {
        System.out.println(\"Hello Java!\");
    }
}
EOF
javac $TMP_DIR/Test.java && java -cp $TMP_DIR Test"

# ----------- JavaScript -----------
echo "Testing JavaScript..."
docker run --rm -i $IMAGE bash -c "echo 'console.log(\"Hello JS!\")' > $TMP_DIR/test.js && node $TMP_DIR/test.js"

# ----------- Swift -----------
echo "Testing Swift..."
docker run --rm -i $IMAGE bash -c "echo 'print(\"Hello Swift!\")' > $TMP_DIR/test.swift && swift $TMP_DIR/test.swift"

echo "All tests done!"