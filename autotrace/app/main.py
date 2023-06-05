import subprocess
import os
from fastapi import Form, File, UploadFile, FastAPI, Request
from fastapi.responses import FileResponse
from typing import Optional
from uuid import uuid4
from datetime import datetime


AUTOTRACE_COMMAND = '/autotrace/autotrace'
A_FILE_PARAM = 'a_file'
STORAGE_DIR = '/tmp/'
OUTPUT_FILE = '-output-file'
OUTPUT_FORMAT_KEY = '-output-format'
INPUT_FORMAT_KEY = '-input-format'

app = FastAPI()

# You can't mix body fields and mutliple Form parameters
# see: https://stackoverflow.com/questions/65504438/how-to-add-both-file-and-json-body-in-a-fastapi-post-request
@app.post("/autotrace/")
async def autotrace(
    request: Request,    
    a_file: UploadFile = File(...),
    background_color: Optional[str] = Form(
        "FFFFFF", 
        alias="-background-color", 
        description=" <hexadecimal>;  the color of the background that should be ignored, for example FFFFFF; default is no background color."
    ),
    centerline: Optional[bool] = Form(
        None,
        alias="-centerline",
        description="trace a character's centerline, rather than its outline."
    ),
    charcode: Optional[int] = Form(
        None,
        alias="-charcode", 
        description=" <unsigned>;  code of character to load from GF font file."
    ),
    color_count: Optional[int] = Form(
        0,
        alias="-color-count", 
        description=" <unsigned>;  number of colors a color bitmap is reduced to, it does not work on grayscale, allowed are 1..256; default is 0, that means no color reduction is done."
    ),
    corner_always_threshold: Optional[int] = Form(
        60,
        alias="-corner-always-threshold", 
        description=" <angle-in-degrees>;  if the angle at a pixel is less than this, it is considered a corner, even if it is within `corner-surround' pixels of another corner; default is 60."
    ),
    corner_surround: Optional[int] = Form(
        4,
        alias="-corner-surround", 
        description=" <unsigned>;  number of pixels on either side of a point to consider when determining if that point is a corner; default is 4."
    ),
    corner_threshold: Optional[int] = Form(
        100,
        alias="-corner-threshold", 
        description=" <angle-in-degrees>;  if a pixel, its predecessor(s), and its successor(s) meet at an angle smaller than this, it's a corner; default is 100."
    ),
    despeckle_level: Optional[int] = Form(
        0,
        alias="-despeckle-level",
        description="<unsigned>: 0..20; default is 0; no despeckling."
    ),
    despeckle_tightness: Optional[float] = Form(
        2.0,
        alias="-despeckle-tightness", 
        description=" <real>;  0.0..8.0; default is 2.0."
    ),
    dpi: Optional[int] = Form(
        None,
        alias="-dpi", 
        description=" <unsigned>;  The dots per inch value in the input image, affects scaling of mif output image"
    ),
    error_threshold: Optional[float] = Form(
        2.0,
        alias="-error-threshold", 
        description=" <real>;  subdivide fitted curves that are off by more pixels than this; default is 2.0."
    ),
    filter_iterations: Optional[int] = Form(
        4,
        alias="-filter-iterations",
        description=" <unsigned>;  smooth the curve this many times before fitting; default is 4."
    ),
    input_format: Optional[str] = Form(
        "png",
        alias="-input-format",
        description="Available formats;  ppm, png, pbm, pnm, bmp, tga, pgm, gf."
    ),
    help: Optional[bool] = Form(
        None,
        alias="-help",
        description="print this message."
    ),
    line_reversion_threshold: Optional[float] = Form(
        .01,
        alias="-line-reversion-threshold", 
        description=" <real>;  if a spline is closer to a straight line than this, weighted by the square of the curve length, keep it a straight line even if it is a list with curves; default is .01."
    ),
    line_threshold: Optional[float] = Form(
        1.0,
        alias="-line-threshold",
        description=" <real>;  if the spline is not more than this far away from the straight line defined by its endpoints, then output a straight line; default is 1."
    ),
    list_output_formats: Optional[bool] = Form(
        None,
        alias="-list-output-formats",
        description="print a list of supported output formats to stderr."
    ),
    list_input_formats: Optional[bool] = Form(
        None,
        alias="-list-input-formats",
        description="print a list of supported input formats to stderr."
    ),
    log: Optional[bool] = Form(
        None,
        alias="-log", 
        description="write detailed progress reports to <input_name>.log."
    ),
    noise_removal: Optional[float] = Form(
        0.99,
        alias="-noise-removal",
        description=" <real>:;  0.0..1.0; default is 0.99."
    ),
    output_file: Optional[str] = Form(
        None,
        alias="-output-file",
        description=" <filename>;  write to <filename>"
    ),
    output_format: Optional[str] = Form(
        "svg",
        alias="-output-format",
        description="<format>: use format <format> for the output file. Available formats; rpl, tk, cfdg, xfig, plot, svg, plot-svg, gschem, gmfa, text, epd, tek, rib, sk, plot-tek, gmfb, pcl, txt, asy, plot-pcl, tex, gnuplot, cairo, dat, plot-hpgl, lwo, pcb, xml, dr2d, pov, dxf_14, eps, tfig, mp, meta, java1, hpgl, ai, cgm, pdf, latex2e, ps2ai, p2e, java2, pic, svm, plot-cgm, plot-ai, plt, noixml, vtk, tgif, idraw, fig, emf, plot-fig, kil, er, m, dxf, obj, ugs, pcbfill, mif, mma, java, gcode, c, dxf_s, ild, mpost, pcbi"
    ),
    preserve_width: Optional[str] = Form(
        None,
        alias="-preserve-width",
        description="preserve line width prior to thinning."
    ),
    remove_adjacent_corners: Optional[bool] = Form(
        None,
        alias="-remove-adjacent-corners",
        description="remove corners that are adjacent."
    ),
    tangent_surround: Optional[int] = Form(
        3,
        alias="-tangent-surround", 
        description=" <unsigned>;  number of points on either side of a point to consider when computing the tangent at that point; default is 3."
    ),
    version: Optional[bool] = Form(
        None,
        alias="-version",
        description="print the version number of this program."
    ),
    width_weight_factor: Optional[float] = Form(
        None,
        alias="-width-weight-factor", 
        description=" <real>;  weight factor for fitting the linewidth."
    )):

    def make_input_file(file_name):
        form_key = INPUT_FORMAT_KEY[1:]
        default_input_format = input_format
        return STORAGE_DIR+file_name+'.'+form_data.get(form_key, default_input_format)
    def make_output_file(file_name):
        default_output_format = output_format
        form_key = OUTPUT_FORMAT_KEY[1:]
        return STORAGE_DIR+file_name+'.'+form_data.get(form_key, default_output_format)

    def check_variable_type(annotations, variable_name, the_type):
        """
        Use function variable type hints to help loosely type request
        string variables. Mainly used to cast indicator variables, e.g.
        `-centerline` vs `-centerline=True`
        """
        # Check if the variable name is an alias with '-' separators
        if variable_name.startswith('-'):
            variable_name = variable_name.lstrip('-').replace('-', '_')

        # Check if the variable name exists in the annotations
        if variable_name in annotations:
            variable_type = str(annotations[variable_name])
            return the_type.__name__ in variable_type

        return None


    annotations = autotrace.__annotations__ # can this be const, moved outside?
    form_data = await request.form()

    INPUT_FILE = f"{uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}"

    the_postfixed_parameters = {} 

    # Generate a random file name using UUID and current time
    the_postfixed_parameters[OUTPUT_FILE] = make_output_file(INPUT_FILE)

    # Save the uploaded file to disk
    with open(make_input_file(INPUT_FILE), "wb") as f:
        f.write(await a_file.read())
    
    # Build the command to call autotrace
    command = ["/autotrace/autotrace"]
    
    the_autotrace_parameters = {
        key: value for key, value in form_data.items() if key != A_FILE_PARAM
    }

    for key, value in the_autotrace_parameters.items():
        if value and key not in the_postfixed_parameters:
            add_this_parameter = f"{key}={value}"
            if check_variable_type(annotations, key, bool):
                add_this_parameter = f"{key}" # flag or indicator variable
            command.append(add_this_parameter)

    # Add call dependent arguments, mainly randomized filenames
    for key, value in the_postfixed_parameters.items():
        if value:
            command.append(f"{key}={value}")

    # postpend with input file
    command.append(make_input_file(INPUT_FILE))

    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    output, error = process.communicate()

    if 0 == process.returncode:
        form_key = OUTPUT_FORMAT_KEY[1:]
        the_user_filename= os.path.splitext(a_file.filename)[0]
        the_extension = form_data.get(form_key, output_format)
        if 'svg' in the_extension:
            the_extension += '+xml'

        return FileResponse(
            the_postfixed_parameters[OUTPUT_FILE],
            filename=the_user_filename + '.' + the_extension,
            media_type="image/" + the_extension
        )
    
    return {
        "returncode": process.returncode,
        "reason": output + " " + error,
        "command": " ".join(command)
    }