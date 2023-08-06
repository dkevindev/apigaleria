import { Request, Response } from 'express';


export const uploadFile = async (req: Request, res: Response) =>{
    try {
  
        
      // Simulação de sucesso
      // Em uma aplicação real, você deve fazer o tratamento adequado para armazenar as imagens e lidar com erros
      res.json({ success: true, message: 'Imagens enviadas com sucesso!' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao enviar imagens.' });
    } 
  };