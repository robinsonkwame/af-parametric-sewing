from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from fastapi import FastAPI, UploadFile, File
from typing import List
import requests
import logging
from starlette.requests import Request
import potpourri3d as pp3d
import os
import tempfile
import shutil

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.0.101:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store the path solver
path_solver = None

@app.on_event("startup")
async def startup_event():
    app.state.tmpdirname = tempfile.mkdtemp()

@app.on_event("shutdown")
async def shutdown_event():
    shutil.rmtree(app.state.tmpdirname)

@app.post("/upload")
async def upload_mesh(request: Request, url: str):
    global path_solver

    import logging
    logging.log(level=logging.INFO, msg=f"{url} inside upload!, {request}")

    # Get file name from URL
    filename = url.rsplit('/', 1)[-1]
    response = requests.get(url)

    # Check if request was successful
    if response.status_code == 200:
        # Save the file temporarily
        temp_file = os.path.join(request.app.state.tmpdirname, filename)

        with open(temp_file, 'wb') as f_out:
            f_out.write(response.content)

        # Read the file
        V, F = pp3d.read_mesh(temp_file)
        
        # Create a path solver using the uploaded mesh
        path_solver = pp3d.EdgeFlipGeodesicSolver(V, F)

        # Delete the temporary file
        if os.path.exists(temp_file):
            os.remove(temp_file)

        return {"filename": filename, "message": "Mesh has been uploaded and path solver has been initialized."}
    else:
        return {"message": f"Error in downloading file from {url}. Please provide a valid URL."}

@app.get("/solve")
async def solve_path(v_start: int, v_end: int):
    global path_solver
    if path_solver is None:
        raise HTTPException(status_code=404, detail="You must upload a mesh first.")

    try:
        # Solve the path
        logging.info(f"Starting the solver ... ")
        path_pts = path_solver.find_geodesic_path(v_start=v_start, v_end=v_end)
        logging.info(f"Finished the solver ... ")

        # Convert path_pts (a numpy array) to a list so that it can be returned as JSON
        path_pts_list = path_pts.tolist()
        return {"path_pts": path_pts_list}
    except Exception as e:
        # Log the exception for diagnostic purposes
        logging.error(f"An error occurred while solving the path: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while solving the path.")

@app.get("/loop")
async def solve_loop_path(v_list: str):
    global path_solver
    if path_solver is None:
        raise HTTPException(status_code=404, detail="You must upload a mesh first.")

    try:
        v_list_int = [int(x) for x in v_list.split(',')]

        v_list_int.append(
            v_list_int[1] # to force a loop back to the start 
        ) 

        # Solve the path
        logging.info(f"Starting the loop solver ... ")
        path_pts = path_solver.find_geodesic_path_poly(v_list=v_list_int) # find_geodesic_loop(v_list=v_list_int)
        logging.info(f"Finished the loop solver ... ")

        # Convert path_pts (a numpy array) to a list so that it can be returned as JSON
        path_pts_list = path_pts.tolist()
        return {"path_pts": path_pts_list}
    except Exception as e:
        # Log the exception for diagnostic purposes
        logging.error(f"An error occurred while solving the path: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while solving the path.")