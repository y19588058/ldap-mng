class RegisterController < ApplicationController
  def index
    clear_flash

    # 入力画面を表示
    @account = Account.new
    render :action => 'index'
  end

  def confirm
    clear_flash

    # 入力値のチェック
    attr = params.require(:account).permit(:uid, :password, :password_confirmation, :givenName, :sn, :email, :company, :fujitsu)
    @account = Account.new(attr)
   
    if @account.valid?
      error1 = false
      error2 = false

      # UIDの重複チェック
      if People.exists?(@account.uid)
        puts "[WARN] UID: #{@account.uid} exists"
        error1 = true
      end
      
      # メールアドレスの重複チェック
      begin
        people = People.find :first, :filter => "(mail=#{@account.email})", :attributes => ["mail"]
        if !people.nil?
          puts "[WARN] Email: #{@account.email} exists"
          p people
          error2 = true
        end
      rescue => e
        p e
      end

      if error1 && error2
        flash.now[:alert] = '登録済みのユーザーIDとメールアドレスです'
        render :action => 'index' and return
      end 
      if error1
        flash.now[:alert] = '登録済みのユーザーIDです'
        render :action => 'index' and return
      end
      if error2
        flash.now[:alert] = '登録済みのメールアドレスです'
        render :action => 'index' and return
      end

      # 正常
      render :action => 'confirm' and return
    else
      # NG。入力画面を再表示
      render :action => 'index' and return
    end
  end

  def thanks
    attr = params.require(:account).permit(:uid, :password, :password_confirmation, :givenName, :sn, :email, :company, :fujitsu)
    @account = Account.new(attr)

    #p "### uid      :" + @account.uid
    #p "### password :" + @account.password
    #p "### passwordc:" + @account.password_confirmation
    #p "### givenName:" + @account.givenName
    #p "### sn       :" + @account.sn
    #p "### email    :" + @account.email

    # ポータルDBへの登録
    uri = PORTAL_SERVER_ADDR + "nextpf/dbmanage/member"
    p uri
    uri = URI.parse(uri)

    req_params = "uid="+@account.uid+"&last_name="+@account.sn+"&first_name="+@account.givenName+"&email="+@account.email+"&company="+@account.company+"&fujitsu="+@account.fujitsu
    p req_params

    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = req_params
    http = Net::HTTP.new(uri.host, uri.port)

    begin
      response = nil
      http.set_debug_output $stderr
      http.read_timeout = 10
      http.start do |h|
        response = h.request(request)
      end

      ret = response.body
      if ret == "OK"
        p "ポータル連携成功!!!"
      else
        p "ポータル連携失敗!!!"
        raise "レスポンスがOK以外"
      end
    rescue => e
      flash[:notice] = 'ユーザー登録に失敗しました。お手数ですがNEXT-PF管理者までご連絡下さい。'
      render :action => 'index' and return
    end

    # LDAPへの登録
    user = People.new
    user.cn = @account.uid
    user.givenName = @account.givenName
    user.sn = @account.sn
    user.gecos = @account.uid + ",,,"
    user.gidNumber = "10000"
    user.homeDirectory = "dummy"
    user.loginShell = "/sbin/nologin"
    user.user_password = ActiveLdap::UserPassword.ssha(@account.password)
    user.uidNumber = "10000"
    user.uid = @account.uid
    user.mail = @account.email
    user.description = @account.company
    user.employeeType = @account.fujitsu

    if user.save
      p "LDAP登録成功!!!"
    else
      p "LDAP登録失敗!!!"
      p user.errors.full_messages
      flash[:notice] = 'ユーザー登録に失敗しました。お手数ですがNEXT-PF管理者までご連絡下さい。'
      render :action => 'index' and return
    end

    flash[:notice] = 'ユーザー登録に成功しました。'

    # 完了画面を表示
    @account = Account.new
    render :action => 'index'
  end
end
