class ChangepasswordController < ApplicationController
  def index
    clear_flash

    # 入力画面を表示
    @account = Password.new
    @user = People.new
    #p @user.errors.full_messages

    @account.uid = params[:uid]

    render :action => 'index'
  end

  def thanks
    attr = params.require(:password).permit(:uid, :password_old, :password, :password_confirmation)
    @account = Password.new(attr)
    @user = People.new

    if @account.invalid?
      # NG。入力画面を再表示
      render :action => 'index' and return
    end

    #p "### uid      :" + @account.uid
    #p "### passwordo:" + @account.password_old
    #p "### password :" + @account.password
    #p "### passwordc:" + @account.password_confirmation

    if People.exists?(@account.uid) == false 
      flash.now[:alert] = 'ユーザーIDが存在しません'
      render :action => 'index' and return
    end

    begin
      @user = People.find(@account.uid)
      @user.bind(@account.password_old)
    rescue
      flash.now[:alert] = 'ユーザーID、または、パスワードに誤りがあります'
      render :action => 'index' and return
    end    

    @user.user_password = ActiveLdap::UserPassword.ssha(@account.password)
    @user.homeDirectory = "dummy"
    if @user.save
      #p "成功!!!!!"
    else
      p "失敗(save)!!!!!"
      p @user.errors.full_messages
      render :action => 'index' and return
    end

    # 完了画面を表示
    flash[:notice] = 'パスワード変更に成功しました。'
    #render :action => 'thanks'
    render :action => 'index'

  end
end
