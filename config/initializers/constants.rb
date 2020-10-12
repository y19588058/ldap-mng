# ポータル配備サーバのアドレス
PORTAL_SERVER_ADDR = 'http://192.168.0.200:80/'

# LDAP接続先はconfig/initializers/ldap.ymlで定義

if Rails.env == 'production'
    #### 本番の定数
else
    #### 開発の定数
end
