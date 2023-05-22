import subprocess
from fastapi import Form, File, UploadFile, FastAPI, Request
from fastapi.responses import FileResponse
from typing import Optional
from uuid import uuid4
from datetime import datetime
from copy import deepcopy

AUTOTRACE_COMMAND = '/autotrace/autotrace'
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
    centerline: Optional[str] = Form(
        None,
        alias="-centerline",
        description="trace a character's centerline, rather than its outline."
    ),
    charcode: Optional[str] = Form(
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
    dpi: Optional[str] = Form(
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
    help: Optional[str] = Form(
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
    list_output_formats: Optional[str] = Form(
        None,
        alias="-list-output-formats",
        description="print a list of supported output formats to stderr."
    ),
    list_input_formats: Optional[str] = Form(
        None,
        alias="-list-input-formats",
        description="print a list of supported input formats to stderr."
    ),
    log: Optional[str] = Form(
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
    remove_adjacent_corners: Optional[str] = Form(
        None,
        alias="-remove-adjacent-corners",
        description="remove corners that are adjacent."
    ),
    tangent_surround: Optional[int] = Form(
        3,
        alias="-tangent-surround", 
        description=" <unsigned>;  number of points on either side of a point to consider when computing the tangent at that point; default is 3."
    ),
    version: Optional[str] = Form(
        None,
        alias="-version",
        description="print the version number of this program."
    ),
    width_weight_factor: Optional[float] = Form(
        None,
        alias="-width-weight-factor", 
        description=" <real>;  weight factor for fitting the linewidth."
    )):

    form_data = await request.form()

    the_postfixed_parameters = {} # we'll copy from request directly, instead of deepcopy that throws a recursion error

    # Generate a random file name using UUID and current time
    if not output_file:
        output_file =  f"{uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        the_postfixed_parameters['input'] = f"/tmp/{output_file}" + '.'+form_data[INPUT_FORMAT_KEY]
        the_postfixed_parameters['output'] = f"/tmp/{output_file}" + '.'+form_data[OUTPUT_FORMAT_KEY]

        # Save the uploaded file to disk
        with open(the_postfixed_parameters['input'], "wb") as f:
            f.write(await a_file.read())
    
    # Build the command to call autotrace
    command = ["/autotrace/autotrace"]
    
    for key, value in form_data.items():
        if value and key not in the_postfixed_parameters:
            command.append(f"{key}={value}")

    # Add non-empty postfixed arguments
    for key, value in the_postfixed_parameters.items():
        if value:
            command.append(f"{key}={value}")

    result = subprocess.run(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        text=True
    )
    stdout = result.stdout

    return {"the_command": ' '.join(command),
            "stdout": stdout}

    # # Read the output file generated by autotrace
    # output_filename = f"{filename}.{output_format}"
    # with open(output_filename, "r") as f:
    #     output = f.read()
    #     # shoudl we remove this file?
    
    # # Return the output file content as a response
    # return {"filename": output_filename, "content": output}

    # form_data = await request.form()

    # if not output_file:
    #     output_file =  f"{uuid.uuid4().hex}_{int(time.time())}.png"
    # the_autotrace_output = f"/tmp/{output_file}"



    # the_arguments =\
    #     [f"{key}={value}"
    #         for key, value in form_data.items() if value
    # ]

    # # subprocess.run(["path/to/binary_program", "arg1", "arg2"])
    # #return FileResponse(the_autotrace_output, media_type="image/png")
    # result = subprocess.run(
    #     ['/autotrace/autotrace'] + the_arguments,
    #     shell=True,
    #     stdout=subprocess.PIPE,
    #     text=True
    # )
    # stdout = result.stdout

    # return {
    #     'stdout': stdout,
    #     'args': the_arguments
    # }

    # return {
    #     "background_color": background_color,
    #     "filename": a_file.filename
    # }