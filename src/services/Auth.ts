import rootApi from './rootApi'

/**
 * Gửi Google token đến API để đăng nhập
 * @param token Google token (ID token hoặc access token)
 */
export const loginGoogle = async (token: string) => {
    try {
        console.log('Gửi token đến backend:', token);
        
        // Gửi token từ Google đến backend để xác thực
        // Trong GoogleLoginRequest C# class, có thể là IdToken hoặc AccessToken
        const response = await rootApi.post('/api/Auth/google-login', {
            // Gửi cả hai, backend sẽ sử dụng cái phù hợp
            IdToken: token,
            AccessToken: token
        });
        
        console.log('Phản hồi từ backend:', response.data);
        
        // Backend trả về jwt token và thông tin người dùng
        return response.data;
    }
    catch(e: any) {
        console.error("Lỗi đăng nhập Google:", e);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", e.response.data);
            console.error("Headers:", e.response.headers);
        } else if (e.request) {
            console.error("Request was made but no response:", e.request);
        } else {
            console.error("Error:", e.message);
        }
        throw e;
    }
}

