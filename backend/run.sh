#!/bin/bash
docker exec backend /bin/sh -c 'cd /usr/src/app && npx prisma migrate dev --name init --preview-feature && npx prisma generate'
