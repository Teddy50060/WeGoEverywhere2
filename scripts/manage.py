#!/usr/bin/env python3
"""
Project Manager Script - จัดการ Backend, Frontend, Docker
"""

import subprocess
import sys
import os
import argparse
from pathlib import Path
import platform
import time
# import psycopg2 # สำหรับเชื่อมต่อ PostgreSQL (ติดตั้งด้วย pip install psycopg2-binary)

DB_CONFIG = {
    'host': 'localhost',
    'dbname': 'mydatabase',
    'user': 'admin',
    'password': 'root',
}
DB_MIGRATION_PATH = Path("../projects/backend/src/database")
BACKEND_PATH = Path("../projects/backend")
FRONTEND_PATH = Path("../projects/frontend")
DOTENV_PATH = Path("../.env")

class Colors:
    """สีสำหรับแสดงผลใน terminal"""
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_info(message):
    """แสดงข้อความสีฟ้า"""
    print(f"{Colors.BLUE}{Colors.BOLD}ℹ️  {message}{Colors.END}")

def print_success(message):
    """แสดงข้อความสีเขียว"""
    print(f"{Colors.GREEN}{Colors.BOLD}✅ {message}{Colors.END}")

def print_error(message):
    """แสดงข้อความสีแดง"""
    print(f"{Colors.RED}{Colors.BOLD}❌ {message}{Colors.END}")

def print_warning(message):
    """แสดงข้อความสีเหลือง"""
    print(f"{Colors.YELLOW}{Colors.BOLD}⚠️  {message}{Colors.END}")

def run_command(command, cwd=None, shell=False, new_terminal=True):
    """
    รันคำสั่ง โดยสามารถเลือกว่าจะเปิด Terminal ใหม่ (Asynchronous) 
    หรือรันใน Terminal เดิม (Synchronous)
    """
    os_name = platform.system()

    try:
        # --- โหมด Synchronous (รันใน Terminal เดิมและรอให้เสร็จ) ---
        if not new_terminal:
            print_info(f"Running command (Synchronous): {command}")
            
            # ตรวจสอบว่าต้องแยกคำสั่งเป็น List หรือใช้ shell=True
            if shell:
                command_list = command
            else:
                command_list = command.split()
                
            # ใช้ subprocess.run() ซึ่งจะรอให้คำสั่งจบ
            process = subprocess.run(
                command_list,
                shell=shell,
                cwd=cwd,
                check=True # ทำให้เกิด CalledProcessError ถ้าคำสั่งล้มเหลว
            )
            print_info(f"Command finished successfully.")
            return True

        # --- โหมด Asynchronous (เปิด Terminal ใหม่) ---
        else:
            print_info(f"Preparing to run in new terminal ({os_name}): {command}")
            full_command = None
            
            if os_name == "Windows":
                # Windows: ใช้ 'start cmd /k'
                full_command = f'start cmd /k "{command}"'
                process = subprocess.Popen(full_command, shell=True, cwd=cwd)
                
            elif os_name == "Darwin": # macOS
                # macOS: ใช้ osascript
                terminal_app = "Terminal" 
                script = f'tell application "{terminal_app}" to do script "{command}" in window 1'
                full_command = f"osascript -e '{script}'"
                process = subprocess.Popen(full_command, shell=True, cwd=cwd)

            elif os_name == "Linux":
                # Linux: ใช้ gnome-terminal
                full_command = f'gnome-terminal -- /bin/bash -c "{command}; exec bash"'
                process = subprocess.Popen(full_command, shell=True, cwd=cwd)
                
            else:
                # ระบบปฏิบัติการที่ไม่รองรับ new_terminal ให้ใช้ Synchronous แทน
                print_error(f"Unsupported OS for new terminal: {os_name}. Running command synchronously.")
                return run_command(command, cwd=cwd, shell=shell, new_terminal=False)
            
            if full_command:
                print_info("New terminal launched (Asynchronous).")

            return True

    except subprocess.CalledProcessError as e:
        # ดักจับ error จาก subprocess.run(check=True)
        print_error(f"Command failed with error code {e.returncode}")
        return False
    except FileNotFoundError:
        print_error(f"Error: Command or terminal program not found for {os_name}.")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def load_db_config():
    # ******************************************************
    # 1. การตรวจสอบและ Import Library
    # ******************************************************
    try:
        # ตรวจสอบและ import psycopg2
        import psycopg2 
        from psycopg2 import OperationalError 
    except ImportError:
        print_error(f"=============================================================")
        print_error(f"[ERROR] Required library 'psycopg2-binary' is NOT installed.")
        print_error(f"[ACTION] Please run: pip install psycopg2-binary")
        print_error(f"=============================================================")
        sys.exit(1) # จบการทำงานหากไม่มี Library
        
    try:
        # ตรวจสอบและ import dotenv
        from dotenv import load_dotenv
    except ImportError:
        print_error(f"=============================================================")
        print_error(f"[ERROR] Required library 'python-dotenv' is NOT installed.")
        print_error(f"[ACTION] Please run: pip install python-dotenv")
        print_error(f"=============================================================")
        sys.exit(1) # จบการทำงานหากไม่มี Library
    """
    ดึงค่า Environment Variables สำหรับการเชื่อมต่อ PostgreSQL 
    โดยค้นหาไฟล์ .env ใน Directory แม่ (.. จาก scripts/)
    """
    
    dotenv_path = DOTENV_PATH
    
    # โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
    load_dotenv(dotenv_path=dotenv_path) 
    
    if not dotenv_path.is_file():
        print_error(f"Configuration Error: .env file not found at {dotenv_path}")
        return None, 0, 0

    try:
        config = {
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'dbname': os.getenv('POSTGRES_DB', 'WEGO_EVERYWHERE_DB'),
            'user': os.getenv('POSTGRES_USER', 'admin'),
            'password': os.getenv('POSTGRES_PASSWORD', 'root'),
            'port': os.getenv('POSTGRES_PORT', '5432'),
        }
        
        if not all(config.values()):
            # ตรวจสอบเฉพาะตัวแปรสำคัญ ยกเว้น port ที่มีค่าเริ่มต้น
            required = ['POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_PORT']
            missing = [k for k in required if os.getenv(k) is None]
            if missing:
                 raise ValueError(f"Missing required DB variables in .env: {', '.join(missing)}")
            
        # ดึงค่า Retry Configuration
        retries = int(os.getenv('DB_MAX_RETRIES', '15'))
        delay = int(os.getenv('DB_RETRY_DELAY', '5'))
        
        return config, retries, delay
        
    except ValueError as e:
        print_error(f"Configuration Error: {e}")
        return None, 0, 0
    except Exception as e:
        print_error(f"An unexpected error occurred during config loading: {str(e)}")
        return None, 0, 0


def check_db_connection_with_retry(db_config, max_retries, delay):
    """
    พยายามเชื่อมต่อกับ PostgreSQL ซ้ำๆ โดยใช้ psycopg2
    """
    print_info(f"Checking database connection on {db_config['host']}:{db_config['port']} (Max attempts: {max_retries}, Delay: {delay}s)...")
    
    db_config['port'] = int(db_config['port'])

    for attempt in range(1, max_retries + 1):
        try:
            # ใช้ psycopg2.connect เพื่อลองเชื่อมต่อ
            import psycopg2 
            from psycopg2 import OperationalError 
            conn = psycopg2.connect(**db_config)
            conn.close()
            print_info(f"Attempt {attempt}/{max_retries}: Database is ready. 🎉")
            return True
            
        except OperationalError as e:
            # ดักจับ OperationalError (DB ยังไม่เปิด, Connection ถูกปฏิเสธ, Timeout)
            if attempt < max_retries:
                print_error(f"Attempt {attempt}/{max_retries}: Connection failed. Retrying in {delay}s...")
                time.sleep(delay)
            else:
                print_error(f"Attempt {attempt}/{max_retries}: Connection failed. Max retries reached. ❌")
                print_error(f"Final error: {e}")
                return False
                
        except Exception as e:
            # ดักจับ Error อื่น ๆ (เช่น ชื่อผู้ใช้ผิด, รหัสผ่านผิด, ชื่อ DB ผิด)
            print_error(f"A non-retryable error occurred: {e}")
            return False

def run_drizzle_migrate(cwd=None, new_terminal=False):
    """
    โหลด config, ตรวจสอบ DB, และรัน npx drizzle-kit migrate เมื่อ DB พร้อม
    """
    
    # 1. โหลด Configuration
    db_config, max_retries, delay = load_db_config()
    if not db_config:
        return False
        
    # 2. ตรวจสอบ DB ด้วย Retry Logic
    if not check_db_connection_with_retry(db_config, max_retries, delay):
        print_error("Cannot proceed with migration. Database is not available.")
        return False
        
    # 3. รันคำสั่ง Migrate เมื่อ DB พร้อมแล้ว
    command = "npx drizzle-kit migrate"
    
    print_info(f"Database is OPEN. Running command: {command}")
    
    # ใช้ฟังก์ชัน run_command เดิมของคุณ
    success = run_command(
        command=command,
        cwd=cwd, 
        shell=True,
        new_terminal=new_terminal 
    )
    
    if success:
        print_info("Drizzle migration completed successfully. ✅")
    else:
        print_error("Drizzle migration failed. ❌")
        
    return success

def generate_migration(name=None, cwd=None, new_terminal=False):
    """
    Loads DB config, checks if the DB is open, and then runs 
    'npx drizzle-kit generate' to create a new migration file.

    :param name: Optional name for the migration.
    :param cwd: Current Working Directory for the command.
    :param new_terminal: Run asynchronously in a new terminal (default: False/Synchronous).
    :return: True if the command ran successfully, False otherwise.
    """
    
    # 1. Load Configuration (Assumes load_db_config is defined)
    db_config, max_retries, delay = load_db_config()
    if not db_config:
        return False
        
    # 2. Check DB with Retry Logic (Assumes check_db_connection_with_retry is defined)
    # Drizzle Kit needs the DB to be open to reflect the current schema state.
    if not check_db_connection_with_retry(db_config, max_retries, delay):
        print_error("Cannot proceed with migration generation. Database is not available.")
        return False
        
    # 3. Construct the 'drizzle-kit generate' command
    # Use 'generate' instead of 'migrate'
    command = "npx drizzle-kit generate"
    if name:
        command += f" --name='{name}'"
        
    print_info(f"Database is OPEN. Running command: {command}")
    
    # 4. Run the command (Assumes run_command is defined)
    # Use shell=True for npx
    success = run_command(
        command=command,
        cwd=cwd, 
        shell=True,
        new_terminal=new_terminal 
    )
    
    if success:
        print_info("Drizzle migration script generated successfully. ✅")
        print_info("Remember to review the generated file and then run 'migrate'.")
    else:
        print_error("Drizzle migration generation failed. ❌")
        
    return success

def start_backend(dev=False):
    """เริ่ม Backend"""
    print_info("Starting Backend...")
    backend_path = BACKEND_PATH
    
    if not backend_path.exists():
        print_error("Backend directory not found!")
        return False
    
    if dev:
        # Development mode
        command = "npm run start:dev"
    else:
        # Production mode
        command = "npm run start:prod"
    
    return run_command(command, cwd=backend_path, shell=True)

def start_frontend(dev=False):
    """เริ่ม Frontend"""
    print_info("Starting Frontend...")
    frontend_path = FRONTEND_PATH
    
    if not frontend_path.exists():
        print_error("Frontend directory not found!")
        return False
    
    if dev:
        # Development mode
        command = "npm run start:dev"
    else:
        # Production mode
        command = "npm run build && npm run start"
    
    return run_command(command, cwd=frontend_path, shell=True)

def start_docker(service=None, build=False):
    """เริ่ม Docker"""
    print_info("Starting Docker...")
    
    if not Path("../docker-compose.yml").exists():
        print_error("docker-compose.yml not found!")
        return False
    
    # Build ถ้าต้องการ
    if build:
        print_info("Building Docker images...")
        if not run_command("docker-compose build", shell=True):
            return False
    
    # Start services
    if service:
        command = f"docker-compose up {service}"
    else:
        command = "docker-compose up"
    
    return run_command(command, shell=True)

def stop_docker(service=None):
    """หยุด Docker"""
    print_info("Stopping Docker...")
    
    if service:
        command = f"docker-compose stop {service}"
    else:
        command = "docker-compose down"
    
    return run_command(command, shell=True)

def show_logs_docker(service=None, follow=False):
    """แสดง logs ของ Docker"""
    print_info("Showing Docker logs...")
    
    follow_flag = "-f" if follow else ""
    
    if service:
        command = f"docker-compose logs {follow_flag} {service}"
    else:
        command = f"docker-compose logs {follow_flag}"
    
    return run_command(command, shell=True)

def install_dependencies(target):
    """ติดตั้ง dependencies"""
    print_info(f"Installing dependencies for {target}...")
    
    if target == "backend":
        path = BACKEND_PATH
    elif target == "frontend":
        path = FRONTEND_PATH
    else:
        print_error(f"Unknown target: {target}")
        return False
    
    if not path.exists():
        print_error(f"{target} directory not found!")
        return False
    
    return run_command("npm install", cwd=path, shell=True, new_terminal=False)

def generate_api():
    """Generate API client"""
    print_info("Generating API client...")
    frontend_path = FRONTEND_PATH
    
    if not frontend_path.exists():
        print_error("Frontend directory not found!")
        return False
    
    return run_command("npm run generate-api", cwd=frontend_path, shell=True, new_terminal=False)

def main():
    parser = argparse.ArgumentParser(
        description="Project Manager - จัดการ Backend, Frontend, Docker",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python manage.py start all --dev              # เริ่มทุกอย่าง (backend, frontend, db, pgadmin)
  python manage.py start backend --dev          # เริ่ม backend ในโหมด dev
  python manage.py start frontend               # เริ่ม frontend ในโหมด production
  python manage.py start docker --build         # build และเริ่ม docker
  python manage.py start docker --service db    # เริ่มแค่ service db
  python manage.py stop docker                  # หยุด docker
  python manage.py logs docker --follow         # ดู logs แบบ real-time
  python manage.py install backend              # ติดตั้ง dependencies ของ backend
  python manage.py generate-api                 # generate API client
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Start command
    start_parser = subparsers.add_parser("start", help="เริ่มรัน service")
    start_parser.add_argument(
        "target",
        choices=["backend", "frontend", "docker", "all"],
        help="Service ที่ต้องการเริ่ม"
    )
    start_parser.add_argument(
        "--dev",
        action="store_true",
        help="รันในโหมด development"
    )
    start_parser.add_argument(
        "--build",
        action="store_true",
        help="Build docker images ก่อนเริ่ม (สำหรับ docker)"
    )
    start_parser.add_argument(
        "--service",
        help="เริ่มแค่ service ที่ระบุ (สำหรับ docker)"
    )
    start_parser.add_argument(
        "--install", "-i",
        action="store_true",
        help="ติดตั้ง dependencies ก่อนเริ่มรัน service (สำหรับ backend/frontend)"
    )
    start_parser.add_argument(
        "--migrate", "-m",
        action="store_true",
        help="migrate database"
    )
    
    # Stop command
    stop_parser = subparsers.add_parser("stop", help="หยุด service")
    stop_parser.add_argument(
        "target",
        choices=["docker"],
        help="Service ที่ต้องการหยุด"
    )
    stop_parser.add_argument(
        "--service",
        help="หยุดแค่ service ที่ระบุ"
    )
    
    # Logs command
    logs_parser = subparsers.add_parser("logs", help="แสดง logs")
    logs_parser.add_argument(
        "target",
        choices=["docker"],
        help="Service ที่ต้องการดู logs"
    )
    logs_parser.add_argument(
        "--follow", "-f",
        action="store_true",
        help="ติดตาม logs แบบ real-time"
    )
    logs_parser.add_argument(
        "--service",
        help="ดู logs ของ service ที่ระบุ"
    )
    
    # Install command
    install_parser = subparsers.add_parser("install", help="ติดตั้ง dependencies")
    install_parser.add_argument(
        "target",
        choices=["backend", "frontend", "all"],
        help="ติดตั้ง dependencies สำหรับ"
    )
    
    # Generate API command
    subparsers.add_parser("generate-api", help="Generate API client")

    migration_parser = subparsers.add_parser("generate-migration", help="Generate Database Migration")
    migration_parser.add_argument(
        "--name", "-n",
        help="ชื่อของ migration (optional)"
    )
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Execute commands
    success = True
    
    if args.command == "start":
        if args.install:
            success = install_dependencies("backend") and success
            success = install_dependencies("frontend") and success

        if args.target == "backend" or args.target == "all":
            success = start_backend(dev=args.dev) and success
        
        if args.target == "frontend" or args.target == "all":
            success = start_frontend(dev=args.dev) and success
        
        if args.target == "docker" or args.target == "all":
            if(args.target == "all"):
                success = start_docker(
                    service="db",
                    build=args.build
                ) and success
                success = start_docker(
                    service="pgadmin",
                    build=args.build
                ) and success
            else:
                success = start_docker(
                    service=args.service,
                    build=args.build
                ) and success
            if args.migrate:
                success = run_drizzle_migrate(
                    cwd=DB_MIGRATION_PATH,
                    new_terminal=False
                ) and success
    
    elif args.command == "stop":
        if args.target == "docker":
            success = stop_docker(service=args.service)
    
    elif args.command == "logs":
        if args.target == "docker":
            success = show_logs_docker(
                service=args.service,
                follow=args.follow
            )
    
    elif args.command == "install":
        if args.target == "backend" or args.target == "all":
            success = install_dependencies("backend") and success
        
        if args.target == "frontend" or args.target == "all":
            success = install_dependencies("frontend") and success
    
    elif args.command == "generate-api":
        success = generate_api()

    elif args.command == "generate-migration":
        success = generate_migration(args.name, new_terminal=False)
    
    if success:
        print_success("Done!")
    else:
        print_error("Failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()