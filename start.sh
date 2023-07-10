docker run -d --restart=always \
    -p 7700:7700 \
    -e MEILI_MASTER_KEY='lChxpqI5tyYrd7FNelsAoCKbkg=='\
    -v $(pwd)/meili_data:/meili_data \
    getmeili/meilisearch:v0.28 \
    meilisearch --env="development"
