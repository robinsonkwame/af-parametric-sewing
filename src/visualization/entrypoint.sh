#!/bin/bash

export PATH=/autotrace/:$PATH

# Accept the input filename as an argument
input_file="$1"
output_file="/output/output.svg"

# Check if the input file exists
if [ -z "$input_file" ] || [ ! -f "/input/$input_file" ]; then
    echo "Input file not found."
    exit 1
fi

# Run autotrace on the input file
autotrace -centerline "/input/$input_file" -output-file "$output_file"

echo "Conversion completed. SVG file saved to $output_file."
