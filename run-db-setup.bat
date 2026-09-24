@echo off
set "DATABASE_URL=postgresql://neondb_owner:npg_7zCpvBiWt2UD@ep-frosty-breeze-b4w3ayve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
C:\Program Files\nodejs\node.exe db/setup.js