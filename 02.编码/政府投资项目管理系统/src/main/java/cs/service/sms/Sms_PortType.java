/**
 * Sms_PortType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cs.service.sms;

public interface Sms_PortType extends java.rmi.Remote {
    public String connMas() throws java.rmi.RemoteException;
    public String getUpSms(String destaddr) throws java.rmi.RemoteException;
    public String rspUpSms(String msgid) throws java.rmi.RemoteException;
    public String insertDownSms(String batch, String sendbody) throws java.rmi.RemoteException;
    public String getDownSmsResult(String batch, String cnt) throws java.rmi.RemoteException;
    public String getSpecialDownSmsResult(String batch, String msgid) throws java.rmi.RemoteException;
    public boolean checkpass() throws java.rmi.RemoteException;
}
