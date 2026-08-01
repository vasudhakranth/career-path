from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import tempfile
import subprocess
import sys
import os
from typing import Optional

router = APIRouter()


class ExecuteRequest(BaseModel):
    language: str
    code: str
    timeout_seconds: Optional[int] = 5


@router.post("/run")
async def run_code(req: ExecuteRequest):
    lang = (req.language or '').strip().lower()

    def run_process(cmd, timeout):
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout, proc.stderr

    tmp_path = None
    try:
        if lang in ("python", "py"):
            with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
                f.write(req.code or "")
                tmp_path = f.name
            rc, out, err = run_process([sys.executable, tmp_path], req.timeout_seconds)

        elif lang in ("javascript", "js", "node"):
            # requires `node` to be installed on the server
            with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
                f.write(req.code or "")
                tmp_path = f.name
            try:
                rc, out, err = run_process(["node", tmp_path], req.timeout_seconds)
            except FileNotFoundError:
                raise HTTPException(status_code=400, detail="Node.js runtime not found on the server.")

        elif lang in ("java",):
            # Java: write to Main.java, compile then run
            workdir = tempfile.mkdtemp()
            src = os.path.join(workdir, "Main.java")
            with open(src, "w", encoding="utf-8") as f:
                f.write(req.code or "")
            try:
                rc_c, out_c, err_c = run_process(["javac", src], req.timeout_seconds)
                if rc_c != 0:
                    return {"returncode": rc_c, "stdout": out_c, "stderr": err_c}
                rc, out, err = run_process(["java", "-cp", workdir, "Main"], req.timeout_seconds)
            except FileNotFoundError:
                raise HTTPException(status_code=400, detail="Java (javac/java) not found on the server.")
            finally:
                # cleanup class files
                try:
                    for fn in os.listdir(workdir):
                        os.remove(os.path.join(workdir, fn))
                    os.rmdir(workdir)
                except Exception:
                    pass

        elif lang in ("c", "c++", "cpp", "cc"):
            # support C and C++ if compilers are installed (gcc/g++)
            ext = ".c" if lang == "c" else ".cpp"
            compiler = "gcc" if lang == "c" else "g++"
            with tempfile.NamedTemporaryFile("w", suffix=ext, delete=False, encoding="utf-8") as f:
                f.write(req.code or "")
                src_path = f.name
            exe_path = src_path + ".out"
            try:
                rc_c, out_c, err_c = run_process([compiler, src_path, "-o", exe_path], req.timeout_seconds)
                if rc_c != 0:
                    return {"returncode": rc_c, "stdout": out_c, "stderr": err_c}
                rc, out, err = run_process([exe_path], req.timeout_seconds)
            except FileNotFoundError:
                raise HTTPException(status_code=400, detail=f"{compiler} compiler not found on the server.")
            finally:
                try:
                    if os.path.exists(exe_path): os.remove(exe_path)
                except Exception:
                    pass

        else:
            raise HTTPException(status_code=400, detail=f"Language not supported: {req.language}")

        return {"returncode": rc, "stdout": out, "stderr": err}

    except subprocess.TimeoutExpired:
        return {"returncode": -1, "stdout": "", "stderr": f"Execution timed out after {req.timeout_seconds} seconds."}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        # Return traceback in stderr so frontend displays it instead of generic 500
        return {"returncode": -2, "stdout": "", "stderr": f"Internal server error:\n{str(e)}\n\nTRACEBACK:\n{tb}"}
    finally:
        try:
            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
