Rails.application.routes.draw do

  ### REST-API(グローバルIPからのアクセス制限のためURLパスの頭にapiを付与する)
  match 'api/ldapif/users', :via => :post, :to => "users#create"
  match 'api/ldapif/users/:uid', :via => [:put, :patch], :to => "users#update", uid: /[^\/]+/
  match 'api/ldapif/users/:uid', :via => :delete, :to => "users#destroy", uid: /[^\/]+/

  # ユーザ登録フォーム
  get  'ldap/register' => 'register#index'
  post 'ldap/register/confirm' => 'register#confirm'
  post 'ldap/register/thanks' => 'register#thanks'

  # パスワード変更フォーム
  get  'ldap/changepassword' => 'changepassword#index'
  get  'ldap/changepassword/:uid' => 'changepassword#index', uid: /[^\/]+/
  post 'ldap/changepassword/thanks' => 'changepassword#thanks'

  # 登録ユーザ一覧
  get  'ldap/users' => 'users#index'
  delete 'ldap/users' => 'users#deluser', uid: /[^\/]+/

  # 外部サイト
  get "fujitsu/privacy" => redirect("http://www.fujitsu.com/jp/about/resources/privacy/",:status => 301 )

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
