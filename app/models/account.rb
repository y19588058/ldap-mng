class Account
  include ActiveModel::Model

  attr_accessor :uid, :password, :password_confirmation, :givenName, :sn, :email, :company, :fujitsu

  validates :uid, :presence => {:message => 'ユーザIDを入力してください'}
  VALID_UID_REGEX = /\A[\w.-]*[A-Za-z][\w.-]*\z/i
  validates :uid, :format => { :with => VALID_UID_REGEX, :message => 'ユーザIDのフォーマットが正しくありません'}

  validates :password, :presence => {:message => 'パスワードを入力してください'}
  validates_confirmation_of :password, :message => 'パスワードが一致しません'
  validates :password, :length => {:minimum => 8, :message => 'パスワードは8文字以上で入力してください'}
  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@\[-`{-~])[!-~]+\z/i
  validates :password, :format => { :with => VALID_PASSWORD_REGEX, :message => 'パスワードは英・数・記号を一文字ずつ以上含めてください'}
  validates_exclusion_of :uid, in: :password, :message => 'パスワードにユーザーIDを含めないでください'

  validates :givenName, :presence => {:message => '苗字を入力してください'}

  validates :sn, :presence => {:message => '名前を入力してください'}

  validates :email, :presence => {:message => 'メールアドレスを入力してください'}
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, :format => {:with => VALID_EMAIL_REGEX, :message => 'メールアドレスのフォーマットが正しくありません'}

  validates :company, :presence => {:message => '所属会社／部署を入力してください'}
end
