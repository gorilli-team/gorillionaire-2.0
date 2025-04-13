package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/query"
	"github.com/gorilli/gorillionaire-2.0/signal/api/commons"
	"github.com/gorilli/gorillionaire-2.0/signal/api/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/rs/zerolog/log"
)

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func UserRegisterHandler(c *gin.Context) {
	u := User{}
	err := c.BindJSON(&u)
	if err != nil {
		log.Error().Msgf("Failed to bind signal group %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	// qrInterface, exist := c.Get("qr")
	// if !exist {
	// 	log.Error().Msg("Failed to get db interface")
	// 	c.JSON(commons.StatusInternalServerError, gin.H{
	// 		"message": commons.InternalServerError,
	// 	})
	// 	return
	// }
	// qr := qrInterface.(*db.DB)
	// password, err := utils.HashPassword(u.Password)
	// if err != nil {
	// 	log.Error().Msgf("Failed to hash password %v", err)
	// 	c.JSON(commons.StatusInternalServerError, gin.H{
	// 		"message": commons.InternalServerError,
	// 	})
	// 	return
	// }
	// user := model.User{
	// 	Username: u.Username,
	// 	Email:    u.Email,
	// 	Password: password,
	// 	Role:     "user",
	// 	Active:   true,
	// }
	// err = qr.AddUser(&user)
	// if err != nil {
	// 	log.Error().Msgf("Failed to add user %v", err)
	// 	c.JSON(commons.StatusInternalServerError, gin.H{
	// 		"message": commons.InternalServerError,
	// 	})
	// 	return
	// }
	c.JSON(commons.StatusOK, gin.H{
		"message": "User added successfully",
		"status":  "success",
	})
}

func generateJWT(user *model.User, jwtSecret []byte) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(time.Hour * 12).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func UserLoginHandler(c *gin.Context) {
	u := User{}
	err := c.BindJSON(&u)
	if err != nil {
		log.Error().Msgf("Failed to bind signal group %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	qrInterface, exist := c.Get("qr")
	if !exist {
		log.Error().Msg("Failed to get db interface")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	qr := qrInterface.(*query.Query)
	user, err := qr.GetUserByEmail(u.Email)
	if err != nil {
		log.Error().Msgf("Failed to get user %v", err)
		c.JSON(commons.StatusNotFound, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	valid := utils.CheckPasswordHash(u.Password, user.Password)
	if !valid {
		log.Error().Msgf("Failed to check password %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	jwtSecretInterface, exist := c.Get("jwt_secret")
	if !exist {
		log.Error().Msg("Failed to get jwt secret")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	jwtSecret := jwtSecretInterface.([]byte)
	fmt.Println(string(jwtSecret))
	token, err := generateJWT(user, jwtSecret)
	if err != nil {
		log.Error().Err(err).Msg("Failed to generate JWT")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to generate token",
		})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken() // helper function
	if err != nil {
		log.Error().Err(err).Msg("Failed to generate refresh token")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not login"})
		return
	}

	expiresAt := time.Now().Add(24 * time.Hour)

	err = qr.SaveRefreshToken(user.ID, refreshToken, expiresAt)
	if err != nil {
		log.Error().Err(err).Msg("Failed to save refresh token")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not login"})
		return
	}

	c.JSON(commons.StatusOK, gin.H{
		"message":       "User logged in successfully",
		"token":         token,
		"refresh_token": refreshToken,
		"status":        "success",
	})
}

func ApiKeyLoginHandler(c *gin.Context) {
	u := User{}
	err := c.BindJSON(&u)
	if err != nil {
		log.Error().Msgf("Failed to bind signal group %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	qrInterface, exist := c.Get("qr")
	if !exist {
		log.Error().Msg("Failed to get db interface")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	qr := qrInterface.(*query.Query)
	user, err := qr.GetUserByEmail(u.Email)
	if err != nil {
		log.Error().Msgf("Failed to get user %v", err)
		c.JSON(commons.StatusNotFound, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	valid := utils.CheckPasswordHash(u.Password, user.Password)
	if !valid {
		log.Error().Msgf("Failed to check password %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	jwtSecretInterface, exist := c.Get("jwt_secret")
	if !exist {
		log.Error().Msg("Failed to get jwt secret")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	jwtSecret := jwtSecretInterface.([]byte)
	fmt.Println(string(jwtSecret))
	token, err := generateJWT(user, jwtSecret)
	if err != nil {
		log.Error().Err(err).Msg("Failed to generate JWT")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to generate token",
		})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken() // helper function
	if err != nil {
		log.Error().Err(err).Msg("Failed to generate refresh token")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not login"})
		return
	}

	expiresAt := time.Now().Add(24 * time.Hour)

	err = qr.SaveRefreshToken(user.ID, refreshToken, expiresAt)
	if err != nil {
		log.Error().Err(err).Msg("Failed to save refresh token")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not login"})
		return
	}

	c.JSON(commons.StatusOK, gin.H{
		"message":       "User logged in successfully",
		"token":         token,
		"refresh_token": refreshToken,
		"status":        "success",
	})
}

func RefreshTokenHandler(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := c.BindJSON(&req); err != nil || req.RefreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	qr := c.MustGet("qr").(*query.Query)
	jwtSecret := c.MustGet("jwt_secret").([]byte)

	// Find user by refresh token (match stored token)
	user, err := qr.GetUserByRefreshToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid refresh token"})
		return
	}

	newAccessToken, err := generateJWT(user, jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}
