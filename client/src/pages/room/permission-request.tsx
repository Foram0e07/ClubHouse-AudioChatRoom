import { PermissionRequestEvent, useCall } from "@stream-io/video-react-sdk";
import { useState, useEffect, useCallback } from "react";

export const PermissionRequestPanel = () => {
    const [PermissionRequests, setPermissionRequests] = useState<PermissionRequestEvent[]>([]);
    const call = useCall();

    useEffect(() => {
        return call?.on("call.permission_request", (event) => {
            const request = event as PermissionRequestEvent;
            setPermissionRequests((reqs) => [...reqs, request]);
        });
    }, [call]);

    const handlePermissionRequest = useCallback(async (request: PermissionRequestEvent, accept: boolean) => {
        const { user, permissions } = request;
        try {
            if (accept) {
                await call?.grantPermissions(user.id, permissions);
            } else {
                await call?.revokePermissions(user.id, permissions);
            }
            setPermissionRequests((reqs) => reqs.filter((req) => req !== request));
        } catch (err) {
            alert("Error while approving/denying request");
        }
    }, [call]);

    if (!PermissionRequests.length) return null;

    return (
        <div className="permission-requests">
            <h4>Permission Requests</h4>
            {PermissionRequests.map((request) => (
                <div className="permission-request" key={request.user.id}>
                    <span>
                        {request.user.name} requested to {request.permissions.join(", ")}
                    </span>
                    <button onClick={() => handlePermissionRequest(request, true)} style={{backgroundColor:"green"}}>Approve</button>
                    <button onClick={() => handlePermissionRequest(request, false)}>Deny</button>
                </div>
            ))}
        </div>
    );
};
