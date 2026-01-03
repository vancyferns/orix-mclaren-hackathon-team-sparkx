from flask_caching import Cache
import os

cache = Cache()

def init_cache(app):
    # Check if REDIS_URL is set, otherwise use SimpleCache (memory)
    cache_type = 'RedisCache' if os.getenv('REDIS_URL') else 'SimpleCache'
    
    config = {
        'CACHE_TYPE': cache_type,
        'CACHE_DEFAULT_TIMEOUT': 300
    }

    if cache_type == 'RedisCache':
        config['CACHE_REDIS_URL'] = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

    cache.init_app(app, config=config)