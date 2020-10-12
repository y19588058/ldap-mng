class UsersController < ApplicationController

  def index
    @users = People.find(:all)
  end

  def create
    @user = People.new
    @user.cn = params[:cn]
    @user.givenName = params[:givenName]
    @user.sn = params[:sn]
    @user.gecos =  "#{params[:uid]},,,"
    @user.gidNumber = "10000"
    @user.homeDirectory = "dummy"
    @user.loginShell = "/sbin/nologin"
    @user.user_password = ActiveLdap::UserPassword.ssha(params[:user_password])
    @user.uidNumber = "10000"
    @user.uid = params[:uid]
    @user.mail = params[:mail]
    logger.debug "[DEBUG] #{@user}"

    if @user.exist?
      logger.warn "[WARN] 存在するユーザー(uid: #{@user.cn})"
      ret = "SKIP"
    else
      if @user.save
        logger.info "[INFO] LDAPユーザー登録成功(uid: #{@user.cn})"
        ret = "OK"
      else
        logger.error "[ERROR] LDAPユーザー登録失敗(uid: #{@user.cn})"
        ret = "NG"
      end
    end

    render :plain => ret
  end

  def update
    # old_passwordパラメータがあれば、現状のパスワードを検証する
    #if params[:old_password]
    #  begin
    #    @user_tmp = People.find(params[:uid])
    #    @user_tmp.bind(params[:old_password])
    #    logger.info "[INFO] LDAPユーザー認証に成功しました。(uid: #{@user_tmp.cn})"
    #    raise
    #  rescue
    #    logger.error "[ERROR] ユーザーID、または、パスワードに誤りがあります。(uid: #{@user_tmp.cn})"
    #    ret = "NG_AUTH"
    #    render :plain => ret and return
    #  end
    #end

    begin
      @user = People.find(params[:uid])

      @user.cn = params[:cn]
      @user.givenName = params[:givenName]
      @user.sn = params[:sn]
      @user.gecos =  "#{params[:uid]},,,"
      if params[:user_password].present?
        @user.user_password = ActiveLdap::UserPassword.ssha(params[:user_password])
      end
      @user.uid = params[:uid]
      @user.mail = params[:mail]
      logger.debug "[DEBUG] #{@user}"

      if @user.save
        logger.info "[INFO] LDAPユーザー更新成功(uid: #{@user.cn})"
        ret = "OK"
      else
        logger.error "[ERROR] LDAPユーザー更新失敗(uid: #{@user.cn})"
        ret = "NG"
      end
    rescue => e
      logger.warn "[WARN] #{e}"
      logger.warn "[WARN] 存在しないユーザー(uid: #{params[:uid]})"
      ret = 'SKIP'
    end

    render :plain => ret
  end

  def destroy
    begin
      @user = People.find(params[:uid])
      logger.debug "[DEBUG] #{@user}"

      @user.destroy
      ret = 'OK'
      logger.info "[INFO] LDAPユーザー削除成功(uid: #{params[:uid]})"
    rescue => e
      logger.warn "[WARN] #{e}"
      logger.warn "[WARN] 存在しないユーザー(uid: #{params[:uid]})"
      ret = 'SKIP'
    end

    render :plain => ret
  end

  def deluser
    # ポータルDBへの登録
    uri = PORTAL_SERVER_ADDR + "nextpf/dbmanage/member?user_id=" + params[:uid]
    uri = URI.parse(uri)

    request = Net::HTTP::Delete.new(uri.request_uri)
    http = Net::HTTP.new(uri.host, uri.port)

    begin
      response = nil
      http.set_debug_output $stderr
      http.read_timeout = 10
      http.start do |h|
        response = h.request(request)
      end

      ret = response.body
      if ret == "OK" then
        p "ポータル連携成功!!!"
      elsif ret == "ERROR1" then
        flash[:alert] = '削除エラー：PJ管理者権限を持つユーザーです。'
        raise "スポんスがERROR1"
      else
        flash[:alert] = '削除エラー：予期しないエラーが発生しました。NEXT-PF管理者に連絡して下さい。'
        raise "レスポンスがOK以外"
      end
    rescue => e
      p "ポータル連携失敗!!!"
      @users = People.find(:all)
      render :plain => "NG"
    end

    # LDAPから削除
    @del_user = People.find(params[:uid])
    @del_user.destroy

    flash[:notice] = 'ユーザーの削除に成功しました。'
    @users = People.find(:all)
    render :plain => "OK"
  end

end

