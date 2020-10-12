require 'test_helper'

class ChangepasswordControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get changepassword_index_url
    assert_response :success
  end

end
